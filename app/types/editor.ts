/** Represents a single image operation strategy */
export interface IImageOperation {
  readonly type: string
  apply(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, params: Record<string, unknown>): void
}

/** Serializable descriptor of an applied operation */
export interface IOperationDescriptor {
  type: string
  params: Record<string, unknown>
}

/** Metadata for UI rendering of an operation */
export interface IOperationMeta {
  label: string
  icon: string
  defaults: Record<string, unknown>
}

/** Active editing mode */
export type TEditorMode = 'crop' | 'adjust' | 'filters'

/** Export payload for JSON operations export */
export interface IExportPayload {
  version: number
  originalFileName: string
  operations: IOperationDescriptor[]
}

/** Crop parameters */
export interface ICropParams {
  x: number
  y: number
  width: number
  height: number
}

/** Adjustment parameters */
export interface IAdjustmentParams {
  brightness: number
  saturation: number
}

/** Filter definition */
export interface IFilterParams {
  name: TFilterName
  intensity: number
}

export type TFilterName = 'none' | 'grayscale' | 'sepia' | 'invert'
