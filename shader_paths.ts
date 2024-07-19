interface ShaderPaths {
  vertex: string;
  fragment: string;
}

export const Shaders: Map<string, ShaderPaths> = new Map([
  [
    "lambert_diffuse",
    {
      vertex: "/shaders/lambert_diffuse/vertex.glsl",
      fragment: "/shaders/lambert_diffuse/frag.glsl",
    },
  ],
  [
    "blinn_phong",
    {
      vertex: "/shaders/blinn_phong/vertex.glsl",
      fragment: "/shaders/blinn_phong/frag.glsl",
    },
  ],
]);
