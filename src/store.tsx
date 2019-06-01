import { observable, action, computed, flow, reaction } from 'mobx'

export type Messages = Map<number, string>

export class Store {
  @observable private nextId: number = 1;
  @observable private ppl?: object[];

  @observable public moo: number = 0;
  @observable public ha: number = 12;
  @observable public mouseX: number = 0;
  @observable public mouseY: number = 0;
  @observable public fetchingPpl: boolean = false;

  @observable public msgs: Map<number, string> = new Map();

  @action public incMoo = () => {
    this.moo += 1;
  }

  @action public incHa = () => {
    this.ha += 2;
  }

  // No need to use @action.bound for fat arrow functions
  @action public resetBoth = () => {
    this.moo = 0
    this.ha = 0
    this.ppl = []
  }

  // You have to use @action.bound here
  @action.bound public setMouse(x: number, y: number) {
    this.mouseX = x;
    this.mouseY = y;
  }

  // Also here
  @action.bound public addMsg = flow(function* (this: Store, msg: string) {
    const idUsed = this.nextId
    this.msgs.set(this.nextId, msg)
    this.nextId += 1;
    yield new Promise(res => setTimeout(res, 2000))
    this.msgs.delete(idUsed)
  })

  @action.bound public fetchPeople = flow(function* (this: Store) {
    // Limitation: typescript can't infer that res should be of type Response
    // (fetch returns Promise<Response>), but infers it to be of type `any` instead
    // so we have to annotate the type of the response manually.
    this.fetchingPpl = true
    const res: Response = yield fetch(
      'https://uinames.com/api/?region=bosnia%20and%20herzegovina&amount=150&ext'
    )
    const data = yield res.json()
    this.fetchingPpl = false
    if (Array.isArray(data)) {
      this.ppl = data
      this.addMsg(`fetched ${data.length} people 👨‍👩‍👦‍👦`)
    }
  })

  @computed public get sum() {
    return this.moo + this.ha;
  }

  @computed public get mouseBig() {
    return this.mouseX > 500 && this.mouseY > 500
  }

  // Return type annotation is optional, but recommended
  @computed public get numPpl(): number {
    return this.ppl ? this.ppl.length : 0
  }

  myReaction = reaction(() => this.moo, moo => this.addMsg(`moo changed, is now ${moo} 🐄`))
  myReaction2 = reaction(() => this.ha, ha => this.addMsg(`ha changed, is now ${ha} 😂`))
}
