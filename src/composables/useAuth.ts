import { ref, computed } from 'vue';

const token = ref<string>(localStorage.getItem('token') || '');
const user = ref<any>(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null);

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value);

    function setToken(newToken: string) {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    }

    function setUser(newUser: any) {
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    function logout() {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return {
        token: token as any,
        user: user as any,
        isAuthenticated,
        setToken,
        setUser,
        logout,
    };
}
