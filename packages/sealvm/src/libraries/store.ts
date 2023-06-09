import { EOL } from "os";
import { dirname } from "path";
import {
	existsSync, readFileSync, mkdirSync, writeFileSync
} from "fs";

class Store {
	path: string;
	store: any;

	constructor(path: string) {
		this.path = path;
		this.store = {};
	}

	restore() {
		try {
			if (existsSync(dirname(this.path))) {
				const data = readFileSync(this.path, 'utf8');
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
			if (!existsSync(dirname(this.path))) {
				mkdirSync(dirname(this.path), { recursive: true });
			}
			writeFileSync(
				this.path,
				JSON.stringify(this.store, null, 2) + EOL
			);
		} catch (error) {
			//
		}
	}
}

export default Store;
