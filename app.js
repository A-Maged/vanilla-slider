import $ from "jquery";
import Slider, { initAllSliders } from "./Slider";



/* TODO: fix the first prev is not animated */
// window.app = new Slider($(".slider").first(), {
// 	direction: 'prev'
// });

window.app = initAllSliders();
