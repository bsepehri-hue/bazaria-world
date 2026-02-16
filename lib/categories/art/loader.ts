import { ArtForm, ArtDetails, ArtSpecs } from "./art";
// Existing categories...
import { PetsForm, PetsDetails, PetsSpecs } from "./pets";
// import { CarsForm, CarsDetails, CarsSpecs } from "./cars";
// import { HomesForm, HomesDetails, HomesSpecs } from "./homes";
// ...etc

export function loadCategoryConfig(category: string) {
  switch (category) {
    case "art":
      return {
        form: ArtForm,
        details: ArtDetails,
        specs: ArtSpecs,
      };

    case "pets":
      return {
        form: PetsForm,
        details: PetsDetails,
        specs: PetsSpecs,
      };

    // Future categories:
    // case "cars":
    //   return { form: CarsForm, details: CarsDetails, specs: CarsSpecs };

    default:
      return null;
  }
}
