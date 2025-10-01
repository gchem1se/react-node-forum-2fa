-- Database pre-loading INSERT statements for Forum Project
-- Requirements: 5+ users (2+ admins), 4 users with 2 posts each, variety of comments
-- Some posts with 1 less comment than maximum allowed

BEGIN TRANSACTION;

-- Insert Users (5 users: alice, bob are admins; charlie, david, eve are regular users)
INSERT INTO "user" ("username", "email", "password_hash", "salt", "totp_secret", "is_admin") VALUES
('alice', 'alice@example.com', 'd558bb7c193cb86b4d4d856337a1795de82d50b0eef05bd86a3fe9b02100c9ca', '436c3298442b0d8a', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 1),
('bob', 'bob@example.com', 'cb103fc391a4e4dd86a2a50be5b459e123cbb42872e23aef421f918633f18e39', '909977c97ce5b81f', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 1),
('charlie', 'charlie@example.com', '64d1e878d7c773885c15e5f0a2c7bacb1c65e8767eab97050818b1d4f87107a2', 'c98096ab6f33c316', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 0),
('david', 'david@example.com', '33b3d5f2bd794767f0b8e1248c6d4a6335e64d77eb3f353a128d646e0782c5b0', '06e89b7189d6d314', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 0),
('eve', 'eve@example.com', '70060b1a0dc0a201c07be254c0188c516178d74fffb6de1823d46d9351623126', 'bd4f1f475b848ad8', 'LXBSMDTMSP2I5XFXIYRGFVWSFI', 0);

-- Insert Posts (8 total: alice=2, bob=2, charlie=2, david=2)
-- Some posts have max_comments limit, others unlimited (NULL)
-- Alice's posts: one with limit 3, one unlimited
INSERT INTO "post" ("title", "text", "max_comments", "pub_timestamp", "author_id") VALUES
('Welcome to Our Forum', 'Hello everyone! This is the first post on our new forum platform.
Feel free to discuss anything related to web development here.
Let''s make this community great!', 3, 1718445600, 1),
('React Best Practices', 'I''ve been working with React for a while now and wanted to share some best practices I''ve learned:
1. Always use functional components with hooks
2. Keep your components small and focused
3. Use proper state management
What are your thoughts?', NULL, 1718461800, 1);

-- Bob's posts: one with limit 2, one with limit 5
INSERT INTO "post" ("title", "text", "max_comments", "pub_timestamp", "author_id") VALUES
('Database Design Tips', 'As a database administrator, I often see common mistakes in database design.
Here are some key principles to follow:
- Normalize your data properly
- Use appropriate data types
- Index your foreign keys
- Always backup regularly', 2, 1718530500, 2),
('Security in Web Applications', 'Security should be a top priority in any web application.
Key areas to focus on:
• Input validation and sanitization
• Proper authentication and authorization
• HTTPS everywhere
• Regular security audits
Stay safe out there!', 5, 1718557500, 2);

-- Charlie's posts: one with limit 4, one unlimited
INSERT INTO "post" ("title", "text", "max_comments", "pub_timestamp", "author_id") VALUES
('JavaScript ES6 Features', 'ES6 brought so many great features to JavaScript!
My favorites include:
- Arrow functions
- Template literals
- Destructuring assignment
- Promises
Which ES6 features do you use most?', 4, 1718623200, 3),
('Learning Path for Beginners', 'For those just starting out in web development, here''s a suggested learning path:
1. HTML & CSS fundamentals
2. JavaScript basics
3. A frontend framework (React/Vue/Angular)
4. Backend basics (Node.js)
5. Database fundamentals
Take your time with each step!', NULL, 1718630200, 3);

-- David's posts: one with limit 1, one with limit 6
INSERT INTO "post" ("title", "text", "max_comments", "pub_timestamp", "author_id") VALUES
('CSS Grid vs Flexbox', 'Both CSS Grid and Flexbox are powerful layout tools, but when should you use each?
Flexbox: Great for one-dimensional layouts
CSS Grid: Perfect for two-dimensional layouts
Both can work together in the same project!', 1, 1718703900, 4),
('Version Control with Git', 'Git is an essential tool for any developer.
Basic commands everyone should know:
• git init
• git add
• git commit
• git push
• git pull
• git branch
• git merge
Practice these daily!', 6, 1718728200, 4);

-- Insert Comments (variety of authored and anonymous comments)
-- Comments for "Welcome to Our Forum" (post_id=1, max_comments=3, will have 2 comments - 1 less than max)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(2, 1, 1718447400, 'Great initiative, Alice! Looking forward to participating in discussions here.'),
(NULL, 1, 1718450100, 'This looks promising. Hope we get good discussions going.');

-- Comments for "React Best Practices" (post_id=2, unlimited comments)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(3, 2, 1718463600, 'Excellent points! I''d also add:
- Use React.memo for performance optimization
- Implement proper error boundaries'),
(4, 2, 1718466300, 'Thanks for sharing! The point about keeping components small really resonates with me.'),
(NULL, 2, 1718468400, 'What about testing? Should we always write tests for components?'),
(1, 2, 1718470800, 'Great question about testing! Yes, I always recommend writing tests, especially for complex components.');

-- Comments for "Database Design Tips" (post_id=3, max_comments=2, will have 1 comment - 1 less than max)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(1, 3, 1718532300, 'Very helpful tips, Bob! The indexing point is often overlooked by beginners.');

-- Comments for "Security in Web Applications" (post_id=4, max_comments=5)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(3, 4, 1718559300, 'Security is so important! I''d also mention using environment variables for sensitive data.'),
(4, 4, 1718560200, 'Great post! What about SQL injection prevention?'),
(NULL, 4, 1718562000, 'Don''t forget about XSS attacks! Always sanitize user input.'),
(5, 4, 1718562900, 'OWASP Top 10 is a great resource for web security vulnerabilities.');

-- Comments for "JavaScript ES6 Features" (post_id=5, max_comments=4)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(1, 5, 1718625600, 'Arrow functions are my favorite too! So much cleaner than function declarations.'),
(2, 5, 1718627400, 'Template literals have saved me so much time with string concatenation.'),
(NULL, 5, 1718629200, 'What about async/await? That''s been a game-changer for me.');

-- Comments for "Learning Path for Beginners" (post_id=6, unlimited comments)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(4, 6, 1718633600, 'This is exactly what I needed when I started! Great roadmap.'),
(5, 6, 1718635400, 'Would you recommend learning TypeScript after JavaScript basics?'),
(NULL, 6, 1718637000, 'How long should someone spend on each step before moving to the next?');

-- Comments for "CSS Grid vs Flexbox" (post_id=7, max_comments=1, will have 0 comments - 1 less than max)
-- No comments inserted for this post

-- Comments for "Version Control with Git" (post_id=8, max_comments=6)
INSERT INTO "comment" ("author_id", "post_id", "pub_timestamp", "text") VALUES
(1, 8, 1718730000, 'Git is definitely essential! I''d also recommend learning about git rebase.'),
(2, 8, 1718730900, 'Don''t forget about .gitignore files! Very important for keeping repos clean.'),
(3, 8, 1718731800, 'Git hooks are also powerful for automating workflows.'),
(NULL, 8, 1718732700, 'What''s the best way to handle merge conflicts?'),
(5, 8, 1718733600, 'Great basic commands! GitHub Desktop is also helpful for visual learners.');

-- Insert some "interesting" flags to demonstrate the functionality
INSERT INTO "interesting_comment" ("user_id", "comment_id") VALUES
-- Alice finds several comments interesting
(1, 3), -- Charlie's comment on React practices
(1, 7), -- Charlie's comment on security
(1, 11), -- Anonymous comment on ES6 features
-- Bob finds some comments interesting
(2, 4), -- David's comment on React practices
(2, 12), -- David's comment on learning path
-- Charlie finds comments interesting
(3, 1), -- Bob's comment on welcome post
(3, 16), -- Alice's comment on Git
-- David finds comments interesting  
(4, 2), -- Anonymous comment on welcome post
(4, 17), -- Bob's comment on Git
-- Eve finds comments interesting
(5, 6), -- Alice's reply on React practices
(5, 13); -- Eve's own question on learning path

COMMIT;