import AsyncStorage from '@react-native-async-storage/async-storage';

// Execute este código uma vez para limpar TUDO
export const limparStorageCompleto = async () => {
  try {
    console.log('🧹 Limpando AsyncStorage...');

    // Limpar TUDO
    await AsyncStorage.clear();

    console.log('✅ AsyncStorage limpo com sucesso!');
    console.log('🔄 Recarregue o app agora');

    return true;
  } catch (error) {
    console.error('❌ Erro ao limpar:', error);
    return false;
  }
};

// Ou remover chaves específicas:
export const limparStorageEspecifico = async () => {
  try {
    const keys = [
      'tagged_posts',
      'tagged_signatures',
      'tagged_saved_posts',
      'tagged_users_db',
      'tagged_anonymous_ownership',
      'tagged_base_supports',
      'tagged_signature_partitions',
    ];

    await AsyncStorage.multiRemove(keys);
    console.log('✅ Dados limpos!');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
