import $ from "jquery";

const CLASSNAMES = {
	SLIDER: "slider",
	SLIDE: "slide",
	ACTIVE: "slide--active",
	NEXT: "slide--next",
	PREV: "slide--prev",
	CONTROL: "slider-control",
	LEFT_CONTROL: "slider-control--left",
	RIGHT_CONTROL: "slider-control--right",
};

const DIRECTIONS = {
	NEXT: "next",
	PREV: "prev",
};

export function initAllSlider(config) {
	let sliders = [];

	$(`.${CLASSNAMES.SLIDER}`).each((_, el) => {
		sliders.push(new Slider($(el, config)));
	});

	return sliders;
}

export default class Slider {
	constructor(el, config = {}) {
		this.$el = $(el);
		this.$activeEl = null;
		this.isSliding = false;
		this.interval = null;
		this.config = {
			interval: 1000,
			timeout: 600,
			direction: DIRECTIONS.NEXT,
			...config,
		};

		/* Bind events */
		this._bindEventListeners();

		/* Init Cycle */
		this.cycle();
	}

	_bindEventListeners() {
		let self = this;

		/* Next on click */
		this.$el
			.find(`.${CLASSNAMES.RIGHT_CONTROL}`)
			.on("click", (e) => self.slide(DIRECTIONS.NEXT));

		/* Prev on click */
		this.$el
			.find(`.${CLASSNAMES.LEFT_CONTROL}`)
			.on("click", (e) => self.slide(DIRECTIONS.PREV));

		/* Pause on enter */
		this.$el.on("mouseenter", self.pause.bind(self));

		/* Cycle on leave */
		this.$el.on("mouseleave", self.cycle.bind(self));
	}

	pause() {
		clearInterval(this.interval);
	}

	cycle() {
		self = this;

		if (this.interval) {
			clearInterval(this.interval);
		}

		this.interval = setInterval(
			/* TODO: run only if slider is visible */

			self.slide.bind(self, self.config.direction),
			self.config.interval
		);
	}

	slide(direction) {
		/* Disable sliding if isSliding */
		if (this.isSliding) {
			return;
		}

		let self = this;
		this.isSliding = true;

		switch (direction) {
			case DIRECTIONS.NEXT:
				this.next();
				break;
			case DIRECTIONS.PREV:
				this.prev();
				break;
			default:
				console.error("Wrong slide direction");
		}

		/* Allow sliding after timeout */
		_sleep(self.config.timeout).then(() => {
			self.isSliding = false;
		});
	}

	next() {
		let $el = this.$el;

		this.$activeEl = this._getActiveSlide();

		/* remove all classes */
		$el.find(`.${CLASSNAMES.PREV}`).removeClass(CLASSNAMES.PREV);
		$el.find(`.${CLASSNAMES.NEXT}`).removeClass(CLASSNAMES.NEXT);
		$el.find(`.${CLASSNAMES.ACTIVE}`).removeClass(CLASSNAMES.ACTIVE);

		/* next -> active */
		this.$activeEl = this._getNextSlide().addClass(CLASSNAMES.ACTIVE);

		/* set prev */
		this._getPrevSlide().addClass(CLASSNAMES.PREV);

		/* set next */
		this._getNextSlide().addClass(CLASSNAMES.NEXT);
	}

	prev() {
		let $el = this.$el;

		/* remove all classes */
		$el.find(`.${CLASSNAMES.PREV}`).removeClass(CLASSNAMES.PREV);
		$el.find(`.${CLASSNAMES.NEXT}`).removeClass(CLASSNAMES.NEXT);
		$el.find(`.${CLASSNAMES.ACTIVE}`).removeClass(CLASSNAMES.ACTIVE);

		/* prev -> active */
		this.$activeEl = this._getPrevSlide().addClass(CLASSNAMES.ACTIVE);

		/* set prev */
		this._getPrevSlide().addClass(CLASSNAMES.PREV);

		/* set next */
		this._getNextSlide().addClass(CLASSNAMES.NEXT);
	}

	_getActiveSlide() {
		/* find by active-class */
		this.$activeEl = this.$activeEl?.length
			? this.$activeEl
			: this.$el.find(`.${CLASSNAMES.ACTIVE}`);

		/* find first slide */
		this.$activeEl = this.$activeEl?.length
			? this.$activeEl
			: this.$el.find(`.${CLASSNAMES.SLIDE}`).first();

		return this.$activeEl;
	}

	_getPrevSlide($active = this._getActiveSlide()) {
		let $prev = $active.prev().length
			? $active.prev()
			: this.$el.find(`.${CLASSNAMES.SLIDE}`).last();

		return $prev;
	}

	_getNextSlide($active = this._getActiveSlide()) {
		let $next = $active.next().length
			? $active.next()
			: this.$el.find(`.${CLASSNAMES.SLIDE}`).first();

		return $next;
	}
}

function _sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
