// Generate a random 4-byte value
const processRandom = Buffer.allocUnsafe(4);
for (let i = 0; i < 4; i++) {
  processRandom[i] = Math.floor(Math.random() * 256);
}

// Counter initialized to a random value
let counter = Math.floor(Math.random() * 0xFFFFFF);

export class ObjectId {
  private data: Buffer;

  constructor(type: number, timestamp: number) {
    /**
     * insert your code here
     */

    // Allocate 14 bytes total: 1 (type) + 6 (timestamp) + 4 (random) + 3 (counter)
    
    this.data = Buffer.allocUnsafe(14);

    let offset = 0;

    this.data.writeUInt8(type, offset);
    offset += 1;

    this.data.writeUIntBE(timestamp, offset, 6);
    offset += 6;

    processRandom.copy(this.data, offset);
    offset += 4;

    const currentCounter = counter;
    counter = (counter + 1) % 0x1000000;
    this.data.writeUIntBE(currentCounter, offset, 3);
  }

  static generate(type?: number): ObjectId {
    return new ObjectId(type ?? 0, Date.now());
  }

  toString(encoding?: 'hex' | 'base64'): string {
    return this.data.toString(encoding ?? 'hex');
  }
}