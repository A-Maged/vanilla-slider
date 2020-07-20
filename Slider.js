import $ from "jquery";

const ClassName = {
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

export default class Slider {
	constructor() {
		this.$el = $(".slider");
		this.direction = DIRECTIONS.NEXT;
		this.isSliding = false;
		this.interval = null;
		this.config = {
			interval: 1000,
			timeout: 600,
		};

		/* Init Cycle */
		this.cycle();

		/* Bind events */
		this._bindEventListeners();
	}

	_bindEventListeners() {
		let self = this;

		/* Next on click */
		$(`.${ClassName.RIGHT_CONTROL}`).on("click", (e) =>
			self.slide(DIRECTIONS.NEXT)
		);

		$(`.${ClassName.LEFT_CONTROL}`).on("click", (e) =>
			self.slide(DIRECTIONS.PREV)
		);

		/* Pause on hover */
		$(`.${ClassName.SLIDER}`).on("mouseenter", self.pause.bind(self));

		/* Cycle on leave */
		$(`.${ClassName.SLIDER}`).on("mouseleave", self.cycle.bind(self));
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
			self.slide.bind(self, self.direction),
			self.config.interval
		);
	}

	slide(direction) {
		/* Disable sliding if isSliding */
		if (this.isSliding) {
			return;
		}

		this.isSliding = true;
		this.direction = direction;

		console.log(this.direction);

		this.next() || this.prev();

		/* Allow "sliding" after timeout */
		sleep(self.config.timeout).then(() => {
			self.isSliding = false;
		});
	}

	next() {
		if (this.direction !== DIRECTIONS.NEXT) return false;

		let self = this;
		let $el = this.$el;

		let $active = $el.find(`.${ClassName.ACTIVE}`);

		/* remove all classes */
		$el.find(`.${ClassName.PREV}`).removeClass(ClassName.PREV);
		$el.find(`.${ClassName.NEXT}`).removeClass(ClassName.NEXT);
		$el.find(`.${ClassName.ACTIVE}`).removeClass(ClassName.ACTIVE);

		/* next -> active */
		$active = this.getNextSlide($active).addClass(ClassName.ACTIVE);

		/* set prev */
		this.getPrevSlide($active).addClass(ClassName.PREV);

		/* set next */
		this.getNextSlide($active).addClass(ClassName.NEXT);
	}

	prev() {
		if (this.direction !== DIRECTIONS.PREV) return false;

		let self = this;
		let $el = this.$el;

		let $active = $el.find(`.${ClassName.ACTIVE}`);

		/* remove all classes */
		$el.find(`.${ClassName.PREV}`).removeClass(ClassName.PREV);
		$el.find(`.${ClassName.NEXT}`).removeClass(ClassName.NEXT);
		$el.find(`.${ClassName.ACTIVE}`).removeClass(ClassName.ACTIVE);

		/* prev -> active */
		$active = this.getPrevSlide($active).addClass(ClassName.ACTIVE);

		/* set prev */
		this.getPrevSlide($active).addClass(ClassName.PREV);

		/* set next */
		this.getNextSlide($active).addClass(ClassName.NEXT);
	}

	getPrevSlide($active) {
		let $prev = $active.prev().length
			? $active.prev()
			: this.$el.find(`.${ClassName.SLIDE}`).last();

		return $prev;
	}

	getNextSlide($active) {
		let $next = $active.next().length
			? $active.next()
			: this.$el.find(`.${ClassName.SLIDE}`).first();

		return $next;
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
