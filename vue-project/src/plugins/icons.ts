import { App, Component } from 'vue';
const installIcon = {
    install(app: App) {
        console.log(app);

        const iconList = import.meta.glob("@/components/icons/*.vue", { eager: true });
        for (const path in iconList) {
            const name = path.match(/(?<=\/)(\w+)(?=\.vue)/) || [];
            console.log(name);
            app.component(name[0], (iconList[path] as { default: Component }).default);
        }
    }
}

export default installIcon;