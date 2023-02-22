// pipeline.json
export type u32 = number;
export type f32 = number;
export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Vec4 = [number, number, number, number];
export type EntityData = {[component_id: string]: any};
export type AssetUrl = string;

export type Pipeline = {
  /// The type of pipeline to use.
  pipeline: {
    /// The models asset pipeline.
    /// Will import models (including constituent materials and animations) and generate prefabs for them by default.
    type: "Models",
    /// The importer to use to process models.
    importer?: {
      /// The default importer is sufficient for the majority of needs.
      type: "Regular",
    } | {
      /// Import Unity models.
      type: "UnityModels",
      /// Whether or not the Unity prefabs should be converted to Ambient prefabs.
      use_prefabs: boolean,
    } | {
      /// Import Quixel models.
      type: "Quixel",
    },
    /// Use assimp as the importer.
    /// This will support more file formats, but is less well-integrated. Off by default.
    force_assimp?: boolean,
    /// The physics collider to use for this mesh.
    collider?: {
      /// No physics collider. The default.
      type: "None",
    } | {
      /// Extract the physics collider from the model.
      type: "FromModel",
      /// Whether or not the normals should be flipped.
      flip_normals?: boolean,
      /// Whether or not the indices should be reversed for each triangle. On by default.
      reverse_indices?: boolean,
    } | {
      /// Use a spherical character collider.
      type: "Character",
      /// The radius of the collider.
      radius?: f32,
      /// The height of the collider.
      height?: f32,
    },
    /// If a collider is present, this controls how it will interact with other colliders.
    collider_type?: 
      /// This object cannot move (e.g. a wall).
      "Static" | 
      /// This object can move dynamically in the scene (e.g. a physics object).
      "Dynamic" | 
      /// This object should only be present in the trigger-area scene.
      "TriggerArea" | 
      /// This object should only be present in the picking scene.
      "Picking",
    /// Whether or not this mesh should have its texture sizes capped.
    cap_texture_sizes?: 
      /// Cap this model's textures to 128x128.
      "X128" | 
      /// Cap this model's textures to 256x256.
      "X256" | 
      /// Cap this model's textures to 512x512.
      "X512" | 
      /// Cap this model's textures to 1024x1024.
      "X1024" | 
      /// Cap this model's textures to 2048x2048.
      "X2048" | 
      /// Cap this model's textures to 4096x4096.
      "X4096" | 
      /// Cap this model's textures to SIZE x SIZE.
      /// It is strongly recommended that this is a power of two.
      {"Custom": u32},
    /// Treats all assets in the pipeline as variations, and outputs a single asset which is a collection of all assets.
    /// Most useful for grass and other entities whose individual identity is not important.
    collection_of_variants?: boolean,
    /// Output prefabs that can be spawned. On by default.
    output_prefabs?: boolean,
    /// Output the animations that belonged to this model.
    output_animations?: boolean,
    /// If specified, these components will be added to the prefabs produced by `output_prefabs`.
    /// 
    /// This is a great way to specify additional information about your prefab that can be used by gameplay logic.
    /// Note that these components should have static data (i.e. statistics), not dynamic state, as any such state could be
    /// replaced by this prefab being reloaded.
    prefab_components?: EntityData,
    /// If specified, a list of overrides to use for the materials for the mesh.
    material_overrides?: {
      /// The filter for this override (i.e. what it should apply to).
      filter: {
        /// Replace all materials.
        type: "All",
      } | {
        /// Replace all materials that match this name exactly.
        type: "ByName",
        /// The material name to replace. Must match exactly (i.e. is case-sensitive and does not ignore whitespace).
        name: string,
      },
      /// The material to use as the replacement.
      material: {
        /// The name of the material.
        name?: string,
        /// Where the material came from.
        source?: string,
        /// The base color map (i.e. texture) of this material.
        base_color?: AssetUrl,
        /// The opacity map of this material.
        opacity?: AssetUrl,
        /// The normal map of this material.
        normalmap?: AssetUrl,
        /// The metallic roughness map of this material.
        metallic_roughness?: AssetUrl,
        /// The color that this material should be multiplied by. Defaults to white for PBR.
        base_color_factor?: Vec4,
        /// The emissive factor of this material (i.e. the color that it emits). Defaults to black for PBR.
        emissive_factor?: Vec4,
        /// Whether or not this material is transparent. Defaults to false for PBR.
        transparent?: boolean,
        /// The opacity level (between 0 and 1) at which this material will not be rendered.
        /// If the opacity map at a point has an opacity lower than this, that point will not be rendered.
        /// Defaults to 0.5 for PBR.
        alpha_cutoff?: f32,
        /// Whether or not this material is double-sided. Defaults to false for PBR.
        double_sided?: boolean,
        /// The metallic coefficient of this material. Defaults to 1 for PBR.
        metallic?: f32,
        /// The roughness coefficient of this material. Defaults to 1 for PBR.
        roughness?: f32,
        /// The non-PBR specular map of this material. If specified, it will be translated to a PBR equivalent.
        specular?: AssetUrl,
        /// The non-PBR specular exponent of this material. If specified alongside `specular`, it will be translated to a PBR equivalent.
        specular_exponent?: f32,
      },
    }[],
    /// If specified, a list of transformations to apply to this model. This can be used
    /// to correct coordinate space differences between your asset source and the runtime.
    /// 
    /// These will be applied in sequence.
    transforms?: ({
      /// Rotate Y up to Z up.
      type: "RotateYUpToZUp",
    } | {
      /// Rotate X by `deg` degrees.
      type: "RotateX",
      /// The degrees to rotate this model around the X axis.
      deg: f32,
    } | {
      /// Rotate Y by `deg` degrees.
      type: "RotateY",
      /// The degrees to rotate this model around the Y axis.
      deg: f32,
    } | {
      /// Rotate Z by `deg` degrees.
      type: "RotateZ",
      /// The degrees to rotate this model around the Z axis.
      deg: f32,
    } | {
      /// Scale this model.
      type: "Scale",
      /// The factor to scale this model by.
      scale: f32,
    } | {
      /// Translate this model.
      type: "Translate",
      /// The translation to apply to this model (i.e. this model will be moved by `translation` in the current coordinate space).
      translation: Vec3,
    } | {
      /// Scale this model's AABB.
      type: "ScaleAABB",
      /// The factor to scale this model's AABB by.
      scale: f32,
    } | {
      /// Scale this model's animations (spatially, not in time).
      type: "ScaleAnimations",
      /// The factor to scale this model's animations by.
      scale: f32,
    } | {
      /// Re-root this mesh.
      type: "SetRoot",
      /// The name of the node to set as the new root for this mesh.
      name: string,
    } | {
      /// Re-center this mesh such that the root is located at the origin.
      type: "Center",
    })[],
  } | {
    /// The materials asset pipeline.
    /// Will import specific materials without needing to be part of a model.
    type: "Materials",
    /// The importer to use for materials.
    importer: {
      /// Import a single material, as specified.
      /// All of its dependent assets (URLs, etc) will be resolved during the build process.
      type: "Single",
      /// The name of the material.
      name?: string,
      /// Where the material came from.
      source?: string,
      /// The base color map (i.e. texture) of this material.
      base_color?: AssetUrl,
      /// The opacity map of this material.
      opacity?: AssetUrl,
      /// The normal map of this material.
      normalmap?: AssetUrl,
      /// The metallic roughness map of this material.
      metallic_roughness?: AssetUrl,
      /// The color that this material should be multiplied by. Defaults to white for PBR.
      base_color_factor?: Vec4,
      /// The emissive factor of this material (i.e. the color that it emits). Defaults to black for PBR.
      emissive_factor?: Vec4,
      /// Whether or not this material is transparent. Defaults to false for PBR.
      transparent?: boolean,
      /// The opacity level (between 0 and 1) at which this material will not be rendered.
      /// If the opacity map at a point has an opacity lower than this, that point will not be rendered.
      /// Defaults to 0.5 for PBR.
      alpha_cutoff?: f32,
      /// Whether or not this material is double-sided. Defaults to false for PBR.
      double_sided?: boolean,
      /// The metallic coefficient of this material. Defaults to 1 for PBR.
      metallic?: f32,
      /// The roughness coefficient of this material. Defaults to 1 for PBR.
      roughness?: f32,
      /// The non-PBR specular map of this material. If specified, it will be translated to a PBR equivalent.
      specular?: AssetUrl,
      /// The non-PBR specular exponent of this material. If specified alongside `specular`, it will be translated to a PBR equivalent.
      specular_exponent?: f32,
    } | {
      /// Import Quixel materials.
      type: "Quixel",
    },
    /// Whether or not decal prefabs should be created for each of these materials.
    output_decals?: boolean,
  } | {
    /// The audio asset pipeline.
    /// Will import supported audio file formats and produce Ogg Vorbis files to be used by the runtime.
    type: "Audio",
  },
  /// Filter the sources used to feed this pipeline.
  /// This is a list of glob patterns for accepted files.
  /// All files are accepted if this is empty.
  sources?: string[],
  /// Tags to apply to the output resources.
  tags?: string[],
  /// Categories to apply to the output resources.
  categories?: string[][],
}