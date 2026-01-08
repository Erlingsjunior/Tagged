/**
 * 🔥 Firebase Authentication Service
 *
 * Serviço responsável por toda a lógica de autenticação com Firebase.
 * Mantém compatibilidade com o sistema mock existente durante a migração.
 */

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User as FirebaseUser,
    updateProfile,
    onAuthStateChanged,
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

/**
 * Registro de novo usuário com cadastro progressivo
 *
 * Etapa 1: Email, Nickname, Senha (acesso básico)
 * Etapa 2: CPF, Nome completo, Telefone (cadastro completo)
 */
export const registerUser = async (
    email: string,
    password: string,
    nickname: string,
    fullData?: {
        name?: string;
        cpf?: string;
        phone?: string;
    }
): Promise<{ user: User; firebaseUser: FirebaseUser }> => {
    try {
        console.log('📝 Registrando novo usuário:', email);

        // Criar usuário no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const firebaseUser = userCredential.user;

        // Atualizar displayName com nickname
        await updateProfile(firebaseUser, {
            displayName: nickname,
        });

        // Determinar se o cadastro está completo
        const profileComplete = !!(fullData?.name && fullData?.cpf && fullData?.phone);

        // Criar documento do usuário no Firestore
        const userData: User = {
            id: firebaseUser.uid,
            email: email,
            name: fullData?.name || nickname, // Usa nickname se nome não fornecido
            nickname: nickname, // NOVO campo
            cpf: fullData?.cpf || '', // Opcional
            phone: fullData?.phone || '', // Opcional
            avatar: undefined,
            verified: false,
            role: 'user',
            createdAt: new Date().toISOString(),
            bio: undefined,
            location: undefined,
            stats: {
                reportsCreated: 0,
                reportsSigned: 0,
                impactScore: 0,
            },
            following: [],
            followers: [],
            profileComplete: profileComplete, // NOVO campo
        };

        // Salvar no Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...userData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Usuário registrado com sucesso!');
        console.log(`   📧 Email: ${email}`);
        console.log(`   🏷️  Nickname: ${nickname}`);
        console.log(`   ✅ Perfil completo: ${profileComplete ? 'Sim' : 'Não'}`);

        return { user: userData, firebaseUser };
    } catch (error: any) {
        console.error('❌ Erro ao registrar usuário:', error.message);
        throw error;
    }
};

/**
 * Completar cadastro do usuário (Etapa 2)
 */
export const completeUserProfile = async (
    userId: string,
    data: {
        name: string;
        cpf: string;
        phone: string;
    }
): Promise<void> => {
    try {
        console.log('📝 Completando cadastro do usuário:', userId);

        const userRef = doc(db, 'users', userId);

        await updateDoc(userRef, {
            name: data.name,
            cpf: data.cpf,
            phone: data.phone,
            profileComplete: true,
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Cadastro completado com sucesso!');
    } catch (error: any) {
        console.error('❌ Erro ao completar cadastro:', error.message);
        throw error;
    }
};

/**
 * Login de usuário
 */
export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: User; firebaseUser: FirebaseUser }> => {
    try {
        console.log('🔐 Fazendo login:', email);

        // Autenticar no Firebase
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const firebaseUser = userCredential.user;

        // Buscar dados do usuário no Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (!userDoc.exists()) {
            throw new Error('Dados do usuário não encontrados');
        }

        const userData = userDoc.data() as User;

        console.log('✅ Login realizado com sucesso!');
        console.log(`   📧 Email: ${email}`);
        console.log(`   🏷️  Nickname: ${userData.nickname}`);
        console.log(`   ✅ Perfil completo: ${userData.profileComplete ? 'Sim' : 'Não'}`);

        return { user: userData, firebaseUser };
    } catch (error: any) {
        console.error('❌ Erro ao fazer login:', error.message);
        throw error;
    }
};

/**
 * Logout de usuário
 */
export const logoutUser = async (): Promise<void> => {
    try {
        console.log('👋 Fazendo logout...');
        await signOut(auth);
        console.log('✅ Logout realizado com sucesso!');
    } catch (error: any) {
        console.error('❌ Erro ao fazer logout:', error.message);
        throw error;
    }
};

/**
 * Observar mudanças no estado de autenticação
 */
export const observeAuthState = (
    callback: (user: FirebaseUser | null) => void
) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Buscar dados do usuário atual do Firestore
 */
export const getCurrentUserData = async (
    userId: string
): Promise<User | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (!userDoc.exists()) {
            return null;
        }

        return userDoc.data() as User;
    } catch (error: any) {
        console.error('❌ Erro ao buscar dados do usuário:', error.message);
        return null;
    }
};

/**
 * Verificar se usuário tem perfil completo
 */
export const checkProfileComplete = async (userId: string): Promise<boolean> => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));

        if (!userDoc.exists()) {
            return false;
        }

        const userData = userDoc.data();
        return userData.profileComplete === true;
    } catch (error: any) {
        console.error('❌ Erro ao verificar perfil:', error.message);
        return false;
    }
};
