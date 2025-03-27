class swImage extends HTMLElement {
	static defaults = {
		'width': '100%',
		'height': '160',
		'bg-color': '#dadef0',
		'text-color': '#1c2428',
		'font-family': 'ui-sans-serif, system-ui, sans-serif',
		'font-size': '1rem',
		'font-weight': '600',
		'title': 'Placeholder',
		'text': '',
	};

	// Work around intrinsic element size (300px x 150px)
	// for replaced elements by setting width and height on :host
	// https://svgwg.org/specs/integration/#svg-css-sizing
	// https://www.w3.org/TR/CSS2/visudet.html#inline-replaced-width
	static style = `
    	:host {
	  		display: inline-block;
      		inline-size: 100%;
      		block-size: auto;
			vertical-align: bottom;
		}
		svg,
		img {
			display: inline-block;
			vertical-align: bottom;
		}
        :host([fluid]) svg,
        :host([fluid]) img {
            inline-size: 100%;
            height: auto;
        }
  	`;

	connectedCallback() {
		const shadowRoot = this.attachShadow({ mode: "open" });

		const sheet = new CSSStyleSheet();
		sheet.replaceSync(swImage.style);
		shadowRoot.adoptedStyleSheets = [sheet];

		//shadowRoot.innerHTML = this.buildOutput();
		const slot = document.createElement('slot');
		slot.setAttribute('name', 'default');
		shadowRoot.appendChild(slot);

		// buildOutput into slot
		slot.innerHTML = this.buildOutput();
	}

	getAttributeValue(attrName) {
		const value = this.getAttribute(attrName);
		return value || swImage.defaults[attrName];
	}

	getConfig() {
		this.config = {};
		Object.keys(swImage.defaults).forEach(key => {
			const camelCaseKey = key.replace(/-([a-z])/g, (match, group) => group.toUpperCase());
			this.config[camelCaseKey] = this.getAttributeValue(key);
		});

		this.config.title = this.getAttribute('title') === '' ? '' : this.config.title;
		this.config.text = this.getAttribute('text') || `${this.config.width}&times;${this.config.height}`;
	}

	escapeQuotes(item) {
		//return item.replace(/"/g, '\\"');
		return item.replace(/"/g, '\'');
	}

	determineSettings() {
		const settings = {};
		const config = this.config;

		settings.fontFamily = this.escapeQuotes(config.fontFamily);
		settings.showTitle = !!config.title ? `<title>${config.title}</title>` : null;
		settings.showText = !!config.text ? `
                <foreignObject x="0" y="0" width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; box-sizing: border-box; padding: .5rem; font-family: ${settings.fontFamily}; font-size: ${config.fontSize}; font-weight: ${config.fontWeight}; color: ${config.textColor}; line-height: 1.25; overflow-wrap: break-word; text-align: center; display: flex; justify-content: center; align-items: center;">
                        ${config.text}
                    </div>
                </foreignObject>
            ` : null;
		settings.ariaLabel = settings.showTitle || settings.showText
			? settings.showTitle
				? config.title + (settings.showText ? ` : ${config.text}` : '')
				: config.text
			: null;
		settings.ariaAttr = settings.ariaLabel ? ` role="img" aria-label="${settings.ariaLabel}"` : ' aria-hidden="true"';
		settings.altAttr = settings.showTitle || settings.showText ? ` alt="${config.title} : ${config.text}"` : ' aria-hidden="true"';
		settings.titleAttr = settings.showTitle ? ` title="${config.title}"` : '';

		this.settings = settings;
	}

	buildSvg() {
		const config = this.config;
		const settings = this.settings;

		const svg = `<svg width="${config.width}" height="${config.height}"${settings.ariaAttr} xmlns="http://www.w3.org/2000/svg" style="-webkit-user-select: none; -moz-user-select: none; user-select: none; text-anchor: middle;" preserveAspectRatio="xMidYMid slice">
            ${settings.showTitle ? settings.showTitle : ''}
            <rect fill="${config.bgColor}" width="100%" height="100%"/>
            ${settings.showText ? settings.showText : ''}
        </svg>`;
		return svg;
	}

	encodeSvg() {
		return encodeURIComponent(this.buildSvg());
	}

	dataUri() {
		return `data:image/svg+xml;charset=UTF-8,${this.encodeSvg()}`;
	}

	buildImg() {
		const config = this.config;
		const settings = this.settings;

		const img = `<img width="${config.width}" height="${config.height}"${settings.altAttr}${settings.titleAttr} src="${this.dataUri()} "/>`;
		return img;
	}

	buildOutput() {
		this.getConfig();
		this.determineSettings();

		if (this.hasAttribute('img')) {
			return this.buildImg();
		} else {
			return this.buildSvg();
		}
	}
}

customElements.define("sw-image", swImage);
