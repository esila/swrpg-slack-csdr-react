/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      type
      message
      timestamp
      user
      userImage
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      type
      message
      timestamp
      user
      userImage
      createdAt
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      type
      message
      timestamp
      user
      userImage
      createdAt
      updatedAt
    }
  }
`;
export const createFabricObject = /* GraphQL */ `
  mutation CreateFabricObject(
    $input: CreateFabricObjectInput!
    $condition: ModelFabricObjectConditionInput
  ) {
    createFabricObject(input: $input, condition: $condition) {
      id
      fabricId
      data
      createdAt
      updatedAt
    }
  }
`;
export const updateFabricObject = /* GraphQL */ `
  mutation UpdateFabricObject(
    $input: UpdateFabricObjectInput!
    $condition: ModelFabricObjectConditionInput
  ) {
    updateFabricObject(input: $input, condition: $condition) {
      id
      fabricId
      data
      createdAt
      updatedAt
    }
  }
`;
export const deleteFabricObject = /* GraphQL */ `
  mutation DeleteFabricObject(
    $input: DeleteFabricObjectInput!
    $condition: ModelFabricObjectConditionInput
  ) {
    deleteFabricObject(input: $input, condition: $condition) {
      id
      fabricId
      data
      createdAt
      updatedAt
    }
  }
`;
