import ImageryTileLayer from '@arcgis/core/layers/ImageryTileLayer.js'
import DimensionalDefinition from '@arcgis/core/layers/support/DimensionalDefinition.js'
import ColorVariable from '@arcgis/core/renderers/visualVariables/ColorVariable.js'

const darkVisualVariables = [
  new ColorVariable({
    field: 'Magnitude',
    stops: [
      { value: 0, color: [0, 100, 255, 1], label: '0 m/s' },
      { value: 0.1, color: [0, 150, 255, 1] },
      { value: 3, color: [0, 200, 255, 1] },
      { value: 7, color: [0, 220, 130, 1] },
      { value: 15, color: [80, 255, 70, 1] },
      { value: 25, color: [200, 255, 40, 1] },
      { value: 40, color: [255, 255, 0, 1], label: '>40 m/s' },
    ],
  }),
]

const lightVisualVariables = [
  new ColorVariable({
    field: 'Magnitude',
    stops: [
      { value: 0, color: [255, 255, 0, 1], label: '0 m/s' },
      { value: 0.1, color: [200, 255, 40, 1] },
      { value: 3, color: [80, 255, 70, 1] },
      { value: 7, color: [0, 220, 130, 1] },
      { value: 15, color: [0, 200, 255, 1] },
      { value: 25, color: [0, 150, 255, 1] },
      { value: 40, color: [0, 100, 255, 1], label: '>40 m/s' },
    ],
  }),
]

export function createWindLayer(
  currentPressureValue: number,
  currentTimeSlice: number,
  theme: 'light' | 'dark' = 'dark',
) {
  // Create the ImageryTileLayer with the FlowRenderer
  const tileLayer = new ImageryTileLayer({
    url: 'https://tiledimageservices.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Global_Average_Wind_Speeds_Month_Altitude/ImageServer',
    elevationInfo: {
      mode: 'absolute-height',
      offset: 8000,
    },
    renderer: {
      type: 'flow',
      trailLength: 20,
      flowSpeed: 3,
      trailWidth: 2.5,
      visualVariables:
        theme === 'dark' ? darkVisualVariables : lightVisualVariables,
    },
    multidimensionalDefinition: [
      new DimensionalDefinition({
        variableName: 'Vector-MagDir',
        dimensionName: 'StdPressure',
        values: [currentPressureValue],
        isSlice: true,
      }),
      new DimensionalDefinition({
        variableName: 'Vector-MagDir',
        dimensionName: 'StdTime',
        values: [currentTimeSlice],
        isSlice: true,
      }),
    ],
  })
  return tileLayer
}

export function updateLayerDefinition(
  layer: ImageryTileLayer,
  currentPressureValue: number,
  currentTimeSlice: number,
) {
  layer.multidimensionalDefinition = [
    new DimensionalDefinition({
      variableName: 'Vector-MagDir',
      dimensionName: 'StdPressure',
      values: [currentPressureValue],
      isSlice: true,
    }),
    new DimensionalDefinition({
      variableName: 'Vector-MagDir',
      dimensionName: 'StdTime',
      values: [currentTimeSlice],
      isSlice: true,
    }),
  ]
}

export function updateLayerElevation(
  layer: ImageryTileLayer,
  currentOffsetValue: number,
) {
  layer.elevationInfo = {
    mode: 'absolute-height',
    offset: currentOffsetValue,
  }
}

export function updateLayerVisualVariables(
  layer: ImageryTileLayer,
  theme: 'light' | 'dark',
) {
  if (!layer.renderer || layer.renderer.type !== 'flow') return
  const flowRenderer = layer.renderer.clone()
  flowRenderer.visualVariables =
    theme === 'dark' ? darkVisualVariables : lightVisualVariables
  layer.renderer = flowRenderer
}
