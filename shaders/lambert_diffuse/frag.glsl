varying vec3 vNormal;

uniform vec3 lightColor;
uniform vec3 albedoColor;
uniform vec3 lightPos;

void main() {
	vec3 lightDirection = normalize(lightPos);
	float diffuseFactor = max(dot(vNormal, lightDirection), 0.0);
	vec3 diffuseClr = diffuseFactor * lightColor * albedoColor;

	gl_FragColor = vec4(diffuseClr, 1.0);
}