import { series } from "async";
import { exec } from "child_process";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
if (process.argv.includes("main")) {
	main();
}
function main() {
	series([
		(cb) => {
			exec("cp *.html build/", (err, std, stderr) => {
				console.log("HTML files has been copied!");
				return cb();
			});
		},
		(cb) => {
			exec("cp --recursive assets build/", (err, std, stderr) => {
				console.log("Assets has been copied!");
				return cb();
			});
		},
		(cb) => {
			exec("rm build/assets/tailwind.css", (err, std, stderr) => {
				console.log("Tailwind removed!");
				return cb();
			});
		},
		(cb) => {
			exec("npx tailwindcss -m --no-autoprefixer -i ./assets/tailwind.css -o ./build/assets/style.css", (err, std, stderr) => {
				console.log("Tailwind has been rendered!");
				return cb();
			});
		},
		(cb) => {
			exec(`python3 html_classes_obfuscator.py --htmlpath="./build/*.html" --csspath="./build/**/*.css" --jspath="./build/**/*.js"`, (err, std, stderr) => {
				console.log("Code has been obfuscated!");
				return cb();
			});
		},
	]);
}
