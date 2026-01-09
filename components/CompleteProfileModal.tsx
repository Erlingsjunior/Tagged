import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/Theme';
import { useAuthStore } from '../stores/authStore';
import { UserSchema } from '../types';

interface CompleteProfileModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    message?: string;
}

const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const validateCPF = (cpf: string): boolean => {
    const numbers = cpf.replace(/\D/g, '');
    if (numbers.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(numbers.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit > 9) digit = 0;
    if (digit !== parseInt(numbers.charAt(10))) return false;

    return true;
};

export default function CompleteProfileModal({
    visible,
    onClose,
    onSuccess,
    message = "Complete seu perfil para continuar!",
}: CompleteProfileModalProps) {
    const [name, setName] = useState('');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const { completeProfile, isLoading, error } = useAuthStore();

    const cpfValid = cpf.length === 14 && validateCPF(cpf);
    const phoneValid = phone.replace(/\D/g, '').length >= 10;
    const nameValid = name.length >= 3;

    const handleComplete = async () => {
        if (!nameValid) {
            alert('Nome deve ter pelo menos 3 caracteres');
            return;
        }

        if (!cpfValid) {
            alert('CPF inválido');
            return;
        }

        if (!phoneValid) {
            alert('Telefone inválido');
            return;
        }

        const success = await completeProfile(name, cpf, phone);
        if (success) {
            setName('');
            setCpf('');
            setPhone('');
            onSuccess();
        }
    };

    const handleClose = () => {
        setName('');
        setCpf('');
        setPhone('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modalContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="person-circle" size={64} color={theme.colors.primary} />
                            </View>
                            <Text style={styles.title}>Complete seu perfil</Text>
                            <Text style={styles.message}>{message}</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Nome Completo */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Nome Completo *</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Digite seu nome completo"
                                        placeholderTextColor={theme.colors.text.secondary}
                                        value={name}
                                        onChangeText={setName}
                                        editable={!isLoading}
                                    />
                                    {name.length > 0 && (
                                        <Ionicons
                                            name={nameValid ? 'checkmark-circle' : 'close-circle'}
                                            size={24}
                                            color={nameValid ? theme.colors.success : theme.colors.error}
                                            style={styles.icon}
                                        />
                                    )}
                                </View>
                            </View>

                            {/* CPF */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>CPF *</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="000.000.000-00"
                                        placeholderTextColor={theme.colors.text.secondary}
                                        value={cpf}
                                        onChangeText={(text) => setCpf(formatCPF(text))}
                                        keyboardType="numeric"
                                        maxLength={14}
                                        editable={!isLoading}
                                    />
                                    {cpf.length > 0 && (
                                        <Ionicons
                                            name={cpfValid ? 'checkmark-circle' : 'close-circle'}
                                            size={24}
                                            color={cpfValid ? theme.colors.success : theme.colors.error}
                                            style={styles.icon}
                                        />
                                    )}
                                </View>
                                {cpf.length > 0 && !cpfValid && (
                                    <Text style={styles.errorText}>CPF inválido</Text>
                                )}
                            </View>

                            {/* Telefone */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Telefone/WhatsApp *</Text>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="(00) 00000-0000"
                                        placeholderTextColor={theme.colors.text.secondary}
                                        value={phone}
                                        onChangeText={(text) => setPhone(formatPhone(text))}
                                        keyboardType="phone-pad"
                                        maxLength={15}
                                        editable={!isLoading}
                                    />
                                    {phone.length > 0 && (
                                        <Ionicons
                                            name={phoneValid ? 'checkmark-circle' : 'close-circle'}
                                            size={24}
                                            color={phoneValid ? theme.colors.success : theme.colors.error}
                                            style={styles.icon}
                                        />
                                    )}
                                </View>
                            </View>

                            {error && (
                                <Text style={styles.errorTextMain}>{error}</Text>
                            )}

                            {/* Info */}
                            <View style={styles.infoBox}>
                                <Ionicons name="information-circle" size={20} color={theme.colors.primary} />
                                <Text style={styles.infoText}>
                                    Seus dados são necessários para validar sua assinatura na petição oficial.
                                </Text>
                            </View>
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonPrimary]}
                                onPress={handleComplete}
                                disabled={isLoading || !nameValid || !cpfValid || !phoneValid}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={theme.colors.surface} />
                                ) : (
                                    <Text style={styles.buttonTextPrimary}>Completar Cadastro</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.buttonSecondary]}
                                onPress={handleClose}
                                disabled={isLoading}
                            >
                                <Text style={styles.buttonTextSecondary}>Agora não</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '90%',
        paddingBottom: 20,
    },
    scrollView: {
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        paddingTop: 32,
        paddingBottom: 24,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    icon: {
        position: 'absolute',
        right: 16,
    },
    errorText: {
        fontSize: 12,
        color: theme.colors.error,
        marginTop: 4,
    },
    errorTextMain: {
        fontSize: 14,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: 16,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: `${theme.colors.primary}15`,
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: theme.colors.text.secondary,
        marginLeft: 12,
        lineHeight: 18,
    },
    buttons: {
        gap: 12,
        marginBottom: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    buttonTextPrimary: {
        color: theme.colors.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextSecondary: {
        color: theme.colors.text.secondary,
        fontSize: 16,
        fontWeight: '600',
    },
});
