import { Comment } from "../../../types";

export interface CommentItemProps {
    comment: Comment;
    onLike?: (commentId: string) => void;
    onReply?: (commentId: string) => void;
}
