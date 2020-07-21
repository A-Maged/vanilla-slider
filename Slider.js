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

export function initAllSliders(config) {
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

		this._setupClasses();

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
			.on("click", self.slide.bind(self, DIRECTIONS.NEXT));

		/* Prev on click */
		this.$el
			.find(`.${CLASSNAMES.LEFT_CONTROL}`)
			.on("click", self.slide.bind(self, DIRECTIONS.PREV));

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

		/* Must get the active-element before removing all classes */
		this.$activeEl = this._getActiveSlide();

		/* remove all classes */
		$el.find(`.${CLASSNAMES.PREV}`).removeClass(CLASSNAMES.PREV);
		$el.find(`.${CLASSNAMES.NEXT}`).removeClass(CLASSNAMES.NEXT);
		$el.find(`.${CLASSNAMES.ACTIVE}`).removeClass(CLASSNAMES.ACTIVE);

		/* 1. set the new active-element (next -> active)*/
		this.$activeEl = this._getNextSlide().addClass(CLASSNAMES.ACTIVE);

		/* 2. set the new prev-element */
		this._getPrevSlide().addClass(CLASSNAMES.PREV);

		/* 3. set the new next-element */
		this._getNextSlide().addClass(CLASSNAMES.NEXT);
	}

	prev() {
		let $el = this.$el;

		/* Must get the active-element before removing all classes */
		this.$activeEl = this._getActiveSlide();

		/* remove all classes */
		$el.find(`.${CLASSNAMES.PREV}`).removeClass(CLASSNAMES.PREV);
		$el.find(`.${CLASSNAMES.NEXT}`).removeClass(CLASSNAMES.NEXT);
		$el.find(`.${CLASSNAMES.ACTIVE}`).removeClass(CLASSNAMES.ACTIVE);

		/* 1. set the new active-element (prev -> active)*/
		this.$activeEl = this._getPrevSlide().addClass(CLASSNAMES.ACTIVE);

		/* 2. set the new prev-element */
		this._getPrevSlide().addClass(CLASSNAMES.PREV);

		/* 3. set the new next-element */
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
		let $prev = $active.prev(`.${CLASSNAMES.SLIDE}`);

		$prev = $prev.length
			? $prev
			: this.$el.find(`.${CLASSNAMES.SLIDE}`).last();

		return $prev;
	}

	_getNextSlide($active = this._getActiveSlide()) {
		let $next = $active.next(`.${CLASSNAMES.SLIDE}`);

		$next = $next.length
			? $next
			: this.$el.find(`.${CLASSNAMES.SLIDE}`).first();

		return $next;
	}

	_setupClasses() {
		this.$activeEl = this._getActiveSlide();

		/* set active class */
		this.$activeEl.addClass(CLASSNAMES.ACTIVE);

		/* set prev class */
		this._getPrevSlide().addClass(CLASSNAMES.PREV);

		/* set next class */
		this._getNextSlide().addClass(CLASSNAMES.NEXT);
	}
}

function _sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
