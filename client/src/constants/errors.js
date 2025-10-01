export const ErrorCodes = Object.freeze({
  GETTING_POSTS: "ERR_GETTING_POSTS",
  GETTING_POST: "ERR_GETTING_POST",
  POST_NOT_FOUND: "ERR_POST_NOT_FOUND",
  GETTING_COMMENTS: "ERR_GETTING_COMMENTS",
  COMMENT_NOT_FOUND: "ERR_COMMENT_NOT_FOUND",
  UNAUTHORIZED_GETTING_INTERESTING_FLAGS_COUNT:
    "ERR_UNAUTHORIZED_GETTING_INTERESTING_FLAGS_COUNT",
  GETTING_INTERESTING_FLAGS_COUNT: "ERR_GETTING_INTERESTING_FLAGS_COUNT",
  TITLE_NOT_UNIQUE: "ERR_TITLE_NOT_UNIQUE",
  ADDING_POST: "ERR_ADDING_POST",
  EXCEEDING_MAX_COMMENTS: "ERR_EXCEEDING_MAX_COMMENTS",
  ADDING_COMMENT: "ERR_ADDING_COMMENT",
  ADDING_INTERESTING_FLAG: "ERR_ADDING_INTERESTING_FLAG",
  UNAUTHORIZED_DELETING_POST: "ERR_UNAUTHORIZED_DELETING_POST",
  DELETING_POST: "ERR_DELETING_POST",
  UNAUTHORIZED_DELETING_COMMENT: "ERR_UNAUTHORIZED_DELETING_COMMENT",
  DELETING_COMMENT: "ERR_DELETING_COMMENT",
  REMOVING_INTERESTING_FLAG: "ERR_REMOVING_INTERESTING_FLAG",
  UNKNOWN: "ERR_UNKNOWN",
  EDITING_COMMENT: "ERR_EDITING_COMMENT",
  UNAUTHORIZED_EDITING_COMMENT: "ERR_UNAUTHORIZED_EDITING_COMMENT",
  UNAUTHENTICATED: "ERR_UNAUTHENTICATED",
  NEEDS_TOTP: "ERR_NEEDS_TOTP",
  EMPTY_FIELDS: "ERR_EMPTY_FIELDS",
  GETTING_COMMENTS_COUNT: "ERR_GETTING_COMMENTS_COUNT",
  NOT_ADMIN: "ERR_NOT_ADMIN",
});

export const ERROR_MESSAGES = {
  [ErrorCodes.GETTING_POSTS]: "Unable to retrieve posts.",
  [ErrorCodes.GETTING_POST]: "Unable to retrieve the post.",
  [ErrorCodes.POST_NOT_FOUND]: "Post not found.",
  [ErrorCodes.GETTING_COMMENTS]: "Unable to retrieve comments.",
  [ErrorCodes.COMMENT_NOT_FOUND]: "Comment not found.",
  [ErrorCodes.UNAUTHORIZED_GETTING_INTERESTING_FLAGS_COUNT]:
    "You are not authorized to view the interesting flags count.",
  [ErrorCodes.GETTING_INTERESTING_FLAGS_COUNT]:
    "Unable to retrieve the interesting flags count.",
  [ErrorCodes.TITLE_NOT_UNIQUE]: "A post with this title already exists.",
  [ErrorCodes.ADDING_POST]: "An error occurred while adding the post.",
  [ErrorCodes.EXCEEDING_MAX_COMMENTS]:
    "The post has reached the maximum number of comments.",
  [ErrorCodes.ADDING_COMMENT]: "An error occurred while adding the comment.",
  [ErrorCodes.ADDING_INTERESTING_FLAG]: "Could not mark as interesting.",
  [ErrorCodes.UNAUTHORIZED_DELETING_POST]:
    "You are not authorized to delete this post.",
  [ErrorCodes.DELETING_POST]: "An error occurred while deleting the post.",
  [ErrorCodes.UNAUTHORIZED_DELETING_COMMENT]:
    "You are not authorized to delete this comment.",
  [ErrorCodes.DELETING_COMMENT]:
    "An error occurred while deleting the comment.",
  [ErrorCodes.REMOVING_INTERESTING_FLAG]:
    "Could not remove the interesting flag.",
  [ErrorCodes.UNKNOWN]: "Unknown error.",
  [ErrorCodes.EDITING_COMMENT]: "An error occurred while editing the comment.",
  [ErrorCodes.UNAUTHENTICATED]: "You must authenticate to perform this action.",
  [ErrorCodes.NEEDS_TOTP]:
    "You must authenticate with TOTP method to perform this action.",
  [ErrorCodes.UNAUTHORIZED_EDITING_COMMENT]:
    "You are not authorized to delete this comment.",
  [ErrorCodes.GETTING_COMMENTS_COUNT]:
    "An error occurred while getting the comments count.",
  [ErrorCodes.EMPTY_FIELDS]: "Some of the data provided are empty or invalid fields.",
  [ErrorCodes.NOT_ADMIN]: "Only administrators can perform this action.",
};
