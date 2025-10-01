import React from "react";
import PostHomeCard from "./PostHomeCard";
import { ListGroup, Row, Col } from "react-bootstrap";

const PostHomeCardList = ({ posts }) => {
  return (
    <Col>
      <Row>
        <ListGroup as="ul" className="w-100 p-0">
          {posts.toArray().map((item) => (
            <ListGroup.Item
              key={item.id}
              className="p-0 my-0 border-0 bg-light bg-gradient"
            >
              <PostHomeCard post={item} clickable={true} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Row>
    </Col>
  );
};

export default PostHomeCardList;
