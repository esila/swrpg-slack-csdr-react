/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        message
        timestamp
        user
        userImage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getFabricObject = /* GraphQL */ `
  query GetFabricObject($id: ID!) {
    getFabricObject(id: $id) {
      id
      fabricId
      data
      createdAt
      updatedAt
    }
  }
`;
export const listFabricObjects = /* GraphQL */ `
  query ListFabricObjects(
    $filter: ModelFabricObjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFabricObjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fabricId
        data
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessagesByTimestamp = /* GraphQL */ `
  query GetMessagesByTimestamp(
    $type: String
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getMessagesByTimestamp(
      type: $type
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        message
        timestamp
        user
        userImage
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
