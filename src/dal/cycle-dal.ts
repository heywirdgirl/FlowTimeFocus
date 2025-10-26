// src/dal/cycle-dal.ts
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { db,cyclesCollection } from '@/lib/firebase';
import { Cycle, Phase } from '@/lib/types';

export const getCycles = async (userId?: string): Promise<Cycle[]> => {
  try {
    const cyclesCollection = collection(db, 'cycles');
    let q = cyclesCollection;

    if (userId) {
      q = query(cyclesCollection, where('authorId', '==', userId));
    } else {
      q = query(cyclesCollection, where('isPublic', '==', true));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Cycle',
        phases: (data.phases as Phase[]) || [],
        isPublic: data.isPublic ?? false,
        authorId: data.authorId ?? null,
        authorName: data.authorName ?? 'Unknown',
        likes: data.likes ?? 0,
        shares: data.shares ?? 0,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      } as Cycle;
    });
  } catch (error) {
    console.error('Error fetching cycles:', error);
    return [];
  }
};

export const createCycle = async (cycle: Omit<Cycle, 'id'>, userId?: string, displayName?: string): Promise<Cycle> => {
  try {
    if (!cycle.phases.every((phase) => phase.duration > 0 && phase.title)) {
      throw new Error('Invalid phase data: duration must be positive and title is required');
    }
    const cyclesCollection = collection(db, 'cycles');
    const newCycle = {
      ...cycle,
      authorId: userId ?? null,
      authorName: displayName ?? 'Unknown',
      likes: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(cyclesCollection, newCycle);
    return { id: docRef.id, ...newCycle };
  } catch (error) {
    console.error('Error creating cycle:', error);
    throw error;
  }
};

export const updateCycle = async (cycleId: string, updatedData: Partial<Cycle>, userId?: string): Promise<void> => {
  try {
    const cycleDoc = doc(db, 'cycles', cycleId);
    const cycleSnap = await getDoc(cycleDoc);

    if (!cycleSnap.exists()) {
      throw new Error('Cycle does not exist');
    }

    if (userId && cycleSnap.data().authorId !== userId) {
      throw new Error('Unauthorized to update this cycle');
    }

    const updatePayload = {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(cycleDoc, updatePayload);
  } catch (error) {
    console.error('Error updating cycle:', error);
    throw error;
  }
};

export const deleteCycle = async (cycleId: string, userId?: string): Promise<void> => {
  try {
    const cycleDoc = doc(db, 'cycles', cycleId);
    const cycleSnap = await getDoc(cycleDoc);

    if (!cycleSnap.exists()) {
      throw new Error('Cycle does not exist');
    }

    if (userId && cycleSnap.data().authorId !== userId) {
      throw new Error('Unauthorized to delete this cycle');
    }

    await deleteDoc(cycleDoc);
  } catch (error) {
    console.error('Error deleting cycle:', error);
    throw error;
  }
};


// ... (giữ nguyên các hàm hiện có: getCycles, createCycle, updateCycle, deleteCycle)

export const cloneCycle = async (cycleIdToClone: string, userId: string, userDisplayName: string): Promise<Cycle> => {
  if (!userId) {
    throw new Error("Người dùng chưa đăng nhập. Không thể sao chép Cycle.");
  }

  // 1. Lấy dữ liệu Cycle gốc
  const cycleRef = doc(db, 'cycles', cycleIdToClone);
  const cycleSnap = await getDoc(cycleRef);

  if (!cycleSnap.exists()) {
    throw new Error(`Cycle với ID ${cycleIdToClone} không tồn tại.`);
  }

  // 2. Chuẩn bị dữ liệu cho Cycle mới
  const originalData = cycleSnap.data() as Cycle;
  const newCycleData: Cycle = {
    ...originalData,
    name: `[Copy] ${originalData.name}`, // Thêm tiền tố để phân biệt
    authorId: userId,
    authorName: userDisplayName || "Unknown",
    isPublic: false, // Đặt là private
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likes: 0, // Reset likes
    shares: 0, // Reset shares
  };

  // 3. Lưu Cycle mới vào Firestore
  try {
    const newDocRef = await addDoc(cyclesCollection, newCycleData);
    return { ...newCycleData, id: newDocRef.id };
  } catch (error) {
    console.error("Lỗi khi sao chép Cycle:", error);
    throw new Error("Không thể lưu Cycle mới. Vui lòng kiểm tra quyền truy cập.");
  }
};