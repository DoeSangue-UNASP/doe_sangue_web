import { ref } from 'vue';

export interface EnderecoViaCep {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export const useViaCep = () => {
    const carregandoCep = ref(false);
    const erroCep = ref('');

    const buscarEnderecoPorCep = async (cep: string): Promise<EnderecoViaCep | null> => {
        // Remove caracteres não numéricos
        const cepLimpo = cep.replace(/\D/g, '');

        // Valida se tem 8 dígitos
        if (cepLimpo.length !== 8) {
            erroCep.value = 'CEP inválido';
            return null;
        }

        carregandoCep.value = true;
        erroCep.value = '';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            
            if (!response.ok) {
                throw new Error('Erro ao buscar CEP');
            }

            const dados = await response.json();

            if (dados.erro) {
                erroCep.value = 'CEP não encontrado';
                return null;
            }

            return {
                rua: dados.logradouro || '',
                bairro: dados.bairro || '',
                cidade: dados.localidade || '',
                estado: dados.uf || '',
            };
        } catch (error) {
            erroCep.value = error instanceof Error ? error.message : 'Erro ao buscar CEP';
            return null;
        } finally {
            carregandoCep.value = false;
        }
    };

    return {
        carregandoCep,
        erroCep,
        buscarEnderecoPorCep,
    };
};
