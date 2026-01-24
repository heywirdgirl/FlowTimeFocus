import { doc, onSnapshot, setDoc, deleteDoc, collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import type { Cycle } from "../types";
import { cycleTemplates } from "./cycle-templates";
import { CycleStore } from "./cycle-store";

let unsubscribe: (() => void) | null = null;

export const startSyncCycles = (uid: string, store: Pick<CycleStore, 'setCycles' | 'setLoading' | 'setError' | 'get'>) => {
    if (unsubscribe) unsubscribe();

    store.setLoading(true);

    const q = query(collection(db, "users", uid, "cycles"), orderBy("createdAt", "desc"));
    unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            console.log("User has no cycles, creating a default one.");
            const defaultTemplate = cycleTemplates.find(t => t.id === 'template-pomodoro');
            if (defaultTemplate) {
                const newCycleData = { ...defaultTemplate, createdAt: serverTimestamp() };
                delete (newCycleData as any).id;
                addDoc(collection(db, "users", uid, "cycles"), newCycleData);
            }
        } else {
            const cycles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Cycle));
            store.setCycles(cycles);
        }
        store.setLoading(false);
    }, (error) => {
        console.error("Error syncing cycles:", error);
        store.setError(error.message);
        store.setLoading(false);
    });
};

export const stopSyncCycles = () => {
    if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
    }
};

export const saveCycle = async (uid: string, cycle: Cycle) => {
    const { id, ...cycleData } = cycle;
    const cycleRef = doc(db, "users", uid, "cycles", id);
    await setDoc(cycleRef, { ...cycleData, updatedAt: serverTimestamp() }, { merge: true });
};

export const createNewCycleInDb = async (uid: string, cycle: Cycle) => {
    const { id, ...cycleData } = cycle;
    await addDoc(collection(db, "users", uid, "cycles"), { ...cycleData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
};

export const deleteCycle = async (uid: string, cycleId: string) => {
    await deleteDoc(doc(db, "users", uid, "cycles", cycleId));
};
