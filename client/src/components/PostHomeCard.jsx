import React, { useState } from "react";
import { Card, Row, Col, Image, Button, Badge, NavItem } from "react-bootstrap";
import { getIdenticon } from "../utils/utils";
import { formatTimestamp } from "../utils/utils";
import { useNavigate } from "react-router-dom";

const PostHomeCard = ({ post, clickable }) => {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <Card
      as="article"
      tabIndex={0}
      className={`${
        hover ? "shadow-lg border-dark" : "shadow-sm border-dark-subtle"
      } w-100 mb-3`}
      onMouseEnter={clickable ? () => setHover(true) : () => {}}
      onFocus={clickable ? () => setHover(true) : () => {}}
      onMouseLeave={clickable ? () => setHover(false) : () => {}}
      onBlur={clickable ? () => setHover(false) : () => {}}
      onClick={clickable ? () => navigate(`/posts/${post.id}`) : () => {}}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/posts/${post.id}`);
              }
            }
          : () => {}
      }
      role={clickable ? "button" : ""}
    >
      <Card.Body>
        <Row>
          <Col className="col-1 m-0 p-0">
            <Row className="align-items-center justify-content-center text-center">
              <Image
                className="w-auto p-0 m-0"
                src={getIdenticon(post.author)}
                roundedCircle
                alt="avatar"
                width={40}
                height={40}
              />
              <span className="text-muted">{post.author}</span>
            </Row>
          </Col>

          {/* main content */}
          <Col as="main" className="w-100">
            <Card.Title className="mb-1">{post.title}</Card.Title>
            <Card.Text
              className="mb-0 text-muted"
              style={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
            >
              {post.text}
            </Card.Text>
          </Col>

          <Col xs="auto" className="m-3 mt-0">
            <Row className="mt-2">
              <Badge className="text-end bg-light text-muted fw-medium">
                <span>{formatTimestamp(post.pub_timestamp)}</span>
                <i className="bi bi-clock text-muted ms-2"></i>
              </Badge>
            </Row>
            <Row className="flex-column">
              <Badge className="text-end bg-light text-muted w-auto align-self-end fw-medium">
                <span
                  className={
                    post.max_comments !== null &&
                    post.related_comments_n >= post.max_comments
                      ? "text-danger"
                      : ""
                  }
                >
                  {`${post.related_comments_n}${
                    post.max_comments !== null ? "/" + post.max_comments : ""
                  }`}
                </span>
                <i className="bi bi-chat text-muted ms-2"></i>
              </Badge>
            </Row>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PostHomeCard;
