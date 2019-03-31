import { gql } from "apollo-boost";

export const EDIT_PLACE = gql`
  mutation editPlace($id: Int!, $name: String, $isFav: Boolean) {
    EditPlace(placeId: $id, name: $name, isFav: $isFav) {
      ok
      error
    }
  }
`;
  
