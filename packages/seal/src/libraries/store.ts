import * as fs from "fs";
import * as $path from "path";
import * as os from "os";

class Store {
	path: string;
	store: any;

	constructor(path: string) {
		this.path = path;
		this.store = {};
	}

	restore() {
		try {
			if (fs.existsSync($path.dirname(this.path))) {
				const data = fs.readFileSync(this.path, 'utf8');
				if (data) {
					this.store = JSON.parse(data);
				}
			}
		} catch (error) {
			//
		}
	}

	set(key: string, value: any) {
		this.store[key] = value;
	}

	get(key: string) {
		return this.store[key];
	}

	save() {
		try {
			if (!fs.existsSync($path.dirname(this.path))) {
				fs.mkdirSync($path.dirname(this.path), { recursive: true });
			}
			fs.writeFileSync(
				this.path,
				JSON.stringify(this.store, null, 2) + os.EOL
			);
		} catch (error) {
			//
		}
	}
}

export default Store;
