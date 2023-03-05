import { Signal } from "@rbxts/beacon";
import { Workspace } from "@rbxts/services";

export class Setting<T extends AttributeValue> {
	readonly changed = new Signal<[value: T]>();

	constructor(private name: string, initialValue: T) {
		Workspace.SetAttribute(name, initialValue);
		Workspace.GetAttributeChangedSignal(name).Connect(() => this.changed.Fire(this.get()));
	}

	get() {
		return Workspace.GetAttribute(this.name) as T;
	}
}
