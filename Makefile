
build: components index.js
	@component convert src/templates/field.html
	@component convert src/templates/form.html
	@component build --dev


components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
