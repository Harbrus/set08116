#version 450 core
// This shader requires direction.frag and normal_map.frag

// Directional light structure
#ifndef DIRECTIONAL_LIGHT
#define DIRECTIONAL_LIGHT
struct directional_light {
  vec4 ambient_intensity;
  vec4 light_colour;
  vec3 light_dir;
};
#endif

// A material structure
#ifndef MATERIAL
#define MATERIAL
struct material {
  vec4 emissive;
  vec4 diffuse_reflection;
  vec4 specular_reflection;
  float shininess;
};
#endif

// Forward declarations of used functions
vec4 calculate_direction(in directional_light light, in material mat, in vec3 normal, in vec3 view_dir,
                         in vec4 tex_colour);
vec3 calc_normal(in vec3 normal, in vec3 tangent, in vec3 binormal, in sampler2D normal_map, in vec2 tex_coord);

// Direction light being used in the scene
uniform directional_light light;
// Material of the object being rendered
uniform material mat;
// Position of the eye
uniform vec3 eye_pos;
// Texture to sample from
uniform sampler2D tex;
// Normal map to sample from
uniform sampler2D normal_map;

// Incoming vertex position
layout(location = 0) in vec3 vertex_pos;
// Incoming texture coordinate
layout(location = 1) in vec2 tex_coord;
// Incoming normal
layout(location = 2) in vec3 transformed_normal;
// Incoming tangent
layout(location = 3) in vec3 tangent_out;
// Incoming binormal
layout(location = 4) in vec3 binormal_out;

// Outgoing colour
layout(location = 0) out vec4 colour;

void main() {
  // *********************************
  // Sample texture
  vec4 tex_colour = texture(tex, tex_coord);
  // Calculate view direction
  vec3 view_dir = normalize(eye_pos - vertex_pos);
  // Calculate normal from normal map
  vec3 norm = calc_normal(transformed_normal, tangent_out, binormal_out, normal_map, tex_coord);
  // Calculate directional light
  colour = calculate_direction(light, mat, norm, view_dir, tex_colour);
  // *********************************
}