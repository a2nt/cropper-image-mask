import 'app.scss';
import Events from './_events';
import Croppie from './_ui.form.croppie';

function importAll(r) {
    return r.keys().map(r);
}

const images = importAll(require.context('./img/', false, /\.(png|jpe?g|svg)$/));
const fontAwesome = importAll(require.context('font-awesome', false, /\.(otf|eot|svg|ttf|woff|woff2)$/));

const LayoutUI = (($) => {
    // Constants
    const W = window;
    const D = document;
    const $Body = $('body');

    const NAME = 'LayoutUI';

    class LayoutUI {
        static init() {
            const ui = this;
            ui.dispose();

            console.log(`Initializing: ${NAME}`);
        }

        static dispose() {
            console.log(`Destroying: ${NAME}`);
        }
    }

    $(W).on(`${Events.AJAX} ${Events.LOADED}`, () => {
        LayoutUI.init();
    });

    W.LayoutUI = LayoutUI;

    return LayoutUI;
})($);

export default LayoutUI;
