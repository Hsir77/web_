export default {
	methods: {
		geiQian(money) {
			this.money -= money;
			this.$parent.money += money;
		},
	},
};
