const Position = require('./positions');
class Player extends Position {
	constructor (x, y, id, username, angle, role, size, komnata) {
		super(x, y);
		/**
		 * ID's are normally storaged inside database's for user's
		 * since we are generating ID by socket
		 * it can be also private or public doesn't matter that much
		 * but I just made this private
		 *
		 * @name Player.ID#id
		 * @type {integer}
		 * @private
		 * */
		this._id = id;
		this.size = size;
		this.role = role;
		this.angle = angle;
		this.komnata = komnata;
		this.username = username;
	}
	getSize() {
		return this.size;
	}
	getRole() {
		return this.role;
	}
	getAngle() {
		return this.angle;
	}
	getKomnata() {
		return this.komnata;
	}
	setSize(size) {
		this.size = size;
	}
	setRole(role) {
		this.role = role;
	}
	setAngle(angle) {
		this.angle = angle;
	}
	setKomnata(komnata) {
		this.komnata = komnata;
	}
	toJSON() {
		return JSON.stringify(this);
	}
}
module.exports = Player;