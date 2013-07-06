
build: components index.js
	@component convert src/templates/simple_editor.html
	@component convert src/templates/simple_form.html
	@component convert src/templates/simple_table.html
	@component build --dev


components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
