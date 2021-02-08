<template>
	<v-row justify="center" align="center">
		<v-col cols="12" sm="8" md="4">
			<p class="mt-8 text-center">login — user, pass — user</p>
			<v-form @submit.prevent="tryLogin">
				<v-text-field
					v-model="username"
					counter="20"
					:rules="usernameRules"
					label="Логин"
					solo
				></v-text-field>
				<v-text-field
					v-model="password"
					:rules="passwordRules"
					label="Пароль"
					solo
				></v-text-field>
				<v-btn block type="submit">Войти</v-btn>
			</v-form>
		</v-col>
	</v-row>
</template>

<script>
import { mapActions } from 'vuex';

export default {
	layout: 'empty',
	data() {
		return {
			username: '',
			usernameRules: [
				(v) => !!v || 'Обязательно',
				(v) => (v && v.length <= 20) || 'Слишком длинное имя',
			],
			password: '',
			passwordRules: [
				(v) => !!v || 'Обязательно',
				(v) => (v && v.length >= 4) || 'Пароль должен быть длиннее 4 символов',
			],
		};
	},
	methods: {
		...mapActions({
			login: 'loginRequest',
		}),
		async tryLogin() {
			const formData = {
				username: this.username,
				password: this.password,
			};
			try {
				await this.login(formData);
				this.$router.push('/chat')
			} catch (e) {
				console.error(e);
			}
		},
	},
};
</script>
