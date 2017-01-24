import co from 'co';
import chai from 'chai';
import sinon from 'sinon';
import ioc from '../src/app';

const expect = chai.expect;

class OtherModule {}

function sfModule() {}

function someModule(other) {
	this.otherModule = other;
}

class UserClass {
	constructor(sf) {
		this.sf = sf;
	}
}

class QueueClass {}

class PropertyClass {
	constructor(someModule) {
		this.someModule = someModule;
	}
}

describe('IoC container', () => {

	it('should register a new module', () => {
		ioc.register('users', UserClass);

		expect(ioc.modules['users']).to.be.equal(UserClass);
	});

	it('should throw an exception if module does not exist', () => {

		expect(ioc.resolve.bind(ioc, 'undefined_module')).to.throw('Module "undefined_module" is not registered');
	});

	it('should resolve class from a string', () => {

		ioc.modules['queue'] = QueueClass;

		expect(ioc.resolve('queue')).to.be.instanceOf(QueueClass);
	});

	it('should resolve singleton from a string', () => {
		let users = new UserClass;

		ioc.register('users', users);

		expect(ioc.resolve('users')).to.be.instanceOf(UserClass);
		expect(ioc.resolve('users')).to.be.equal(users);
	});

	it('should instantiate UserClass when passed to resolve method', () => {

		ioc.register('sf', sfModule);

		expect(ioc.resolve(UserClass)).to.be.instanceOf(UserClass);
	});

	it('should resolve UserClass dependencies from its constructor', () => {

		ioc.register('sf', sfModule);

		let uc = ioc.resolve(UserClass);

		expect(uc.sf).to.be.instanceOf(sfModule);
	});

	it('should resolve dependencies of the dependencies', () => {

		ioc.register('other', OtherModule);
		ioc.register('someModule', someModule);

		let uc = ioc.resolve(PropertyClass);


		expect(uc.someModule.otherModule).to.be.instanceOf(OtherModule);
	});
});