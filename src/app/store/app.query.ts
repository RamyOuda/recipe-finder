import { gql } from '@apollo/client/core';

export const dofusLabQuery = gql`
  query customSet($id: UUID!) {
    customSetById(id: $id) {
      equippedItems {
        item {
          name
        }
      }
    }
  }
`;
