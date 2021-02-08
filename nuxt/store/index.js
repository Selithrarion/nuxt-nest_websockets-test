export const state = () => ({
	user: null,
});
export const mutations = {
	LOGIN(state, user) {
		state.user = user;
	},
};
export const actions = {
	async loginRequest({ commit }, formData) {
		const user = await this.$axios.$post('/auth/login', formData);
		commit('LOGIN', user);
	},
};
