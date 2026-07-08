import type { IImageOperation } from '~/types/editor'

/**
 * Registry pattern — maps operation type strings to their strategy implementations.
 * Decouples consumers from concrete operation classes.
 */
class OperationRegistry {
  private operations = new Map<string, IImageOperation>()

  register(operation: IImageOperation): void {
    this.operations.set(operation.type, operation)
  }

  get(type: string): IImageOperation | undefined {
    return this.operations.get(type)
  }

  getOrThrow(type: string): IImageOperation {
    const op = this.operations.get(type)
    if (!op) throw new Error(`Unknown operation type: "${type}"`)
    return op
  }

  has(type: string): boolean {
    return this.operations.has(type)
  }

  types(): string[] {
    return [...this.operations.keys()]
  }
}

/** Singleton registry instance */
export const registry = new OperationRegistry()
