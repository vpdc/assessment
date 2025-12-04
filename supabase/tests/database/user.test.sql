BEGIN;

-- ========================================
-- Install pgTAP if not already installed
-- ========================================
CREATE EXTENSION IF NOT EXISTS pgtap WITH SCHEMA extensions;

-- ========================================
-- Plan: total number of tests
-- ========================================
-- Total tests: 32
SELECT plan(31);

-- ========================================
-- 1. is_timezone() FUNCTION TESTS
-- ========================================

-- Test 1: Valid timezone 'Asia/Manila'
SELECT ok(is_timezone('Asia/Manila'), 'Test 1: is_timezone returns TRUE for valid timezone Asia/Manila');

-- Test 2: Valid timezone 'Europe/London'
SELECT ok(is_timezone('Europe/London'), 'Test 2: is_timezone returns TRUE for valid timezone Europe/London');

-- Test 3: Invalid timezone 'Fake/Zone'
SELECT ok(NOT is_timezone('Fake/Zone'), 'Test 3: is_timezone returns FALSE for invalid timezone Fake/Zone');

-- Test 4: Empty string timezone
SELECT ok(NOT is_timezone(''), 'Test 4: is_timezone returns FALSE for empty string');

-- ========================================
-- 2. Setup: insert a base valid user
-- ========================================
INSERT INTO users (first_name, last_name, birthday, timezone)
VALUES ('Alice', 'Smith', '1990-01-01', 'Asia/Manila');

-- ========================================
-- 3. INSERT TESTS
-- ========================================

-- 3.1 first_name column
SELECT lives_ok(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Bob', 'Brown', '1985-06-15', 'Asia/Manila') $$,
'Test 5: Insert with valid first_name succeeds');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES (NULL, 'Brown', '1985-06-15', 'Asia/Manila') $$,
'%violates not-null constraint',
'Test 6: Insert with NULL first_name fails');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('', 'Brown', '1985-06-15', 'Asia/Manila') $$,
'%violates check constraint%',
'Test 7: Insert with empty first_name fails');

-- 3.2 last_name column
SELECT lives_ok(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Charlie', 'Davis', '1980-02-02', 'Asia/Manila') $$,
'Test 8: Insert with valid last_name succeeds');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Charlie', NULL, '1980-02-02', 'Asia/Manila') $$,
'%violates not-null constraint',
'Test 9: Insert with NULL last_name fails');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Charlie', '', '1980-02-02', 'Asia/Manila') $$,
'%min2_text_check%',
'Test 10: Insert with empty last_name fails');

-- 3.3 birthday column
SELECT lives_ok(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('David', 'Evans', '1975-03-03', 'Asia/Manila') $$,
'Test 11: Insert with valid birthday succeeds');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('David', 'Evans', NULL, 'Asia/Manila') $$,
'%not-null constraint',
'Test 12: Insert with NULL birthday fails');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('David', 'Evans', 'not-a-date', 'Asia/Manila') $$,
'%invalid input%',
'Test 13: Insert with invalid birthday fails');

-- 3.4 timezone column
SELECT lives_ok(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Eve', 'Foster', '1995-04-04', 'Europe/London') $$,
'Test 14: Insert with valid timezone succeeds');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Eve', 'Foster', '1995-04-04', NULL) $$,
'%not-null constraint',
'Test 15: Insert with NULL timezone fails');

SELECT throws_like(
$$ INSERT INTO users (first_name, last_name, birthday, timezone)
   VALUES ('Eve', 'Foster', '1995-04-04', 'Fake/Zone') $$,
'%iana_timezone_check%',
'Test 16: Insert with invalid timezone fails');

-- ========================================
-- 4. UPDATE TESTS
-- ========================================

-- 4.1 first_name updates
SELECT lives_ok(
$$ UPDATE users SET first_name='UpdatedAlice' WHERE first_name='Alice' $$,
'Test 17: Update first_name to valid value succeeds');

SELECT throws_like(
$$ UPDATE users SET first_name=NULL WHERE first_name='UpdatedAlice' $$,
'%not-null constraint',
'Test 18: Update first_name to NULL fails');

SELECT throws_like(
$$ UPDATE users SET first_name='' WHERE first_name='UpdatedAlice' $$,
'%min2_text_check%',
'Test 19: Update first_name to invalid fails');

-- 4.2 last_name updates
SELECT lives_ok(
$$ UPDATE users SET last_name='UpdatedSmith' WHERE first_name='UpdatedAlice' $$,
'Test 20: Update last_name to valid value succeeds');

SELECT throws_like(
$$ UPDATE users SET last_name=NULL WHERE first_name='UpdatedAlice' $$,
'%not-null constraint',
'Test 21: Update last_name to NULL fails');

SELECT throws_like(
$$ UPDATE users SET last_name='' WHERE first_name='UpdatedAlice' $$,
'%min2_text_check%',
'Test 22: Update last_name to invalid fails');

-- 4.3 birthday updates
SELECT lives_ok(
$$ UPDATE users SET birthday='2000-01-01' WHERE first_name='UpdatedAlice' $$,
'Test 23: Update birthday to valid value succeeds');

SELECT throws_like(
$$ UPDATE users SET birthday=NULL WHERE first_name='UpdatedAlice' $$,
'%not-null constraint',
'Test 24: Update birthday to NULL fails');

SELECT throws_like(
$$ UPDATE users SET birthday='not-a-date' WHERE first_name='UpdatedAlice' $$,
'%invalid input%',
'Test 25: Update birthday to invalid fails');

-- 4.4 timezone updates
SELECT lives_ok(
$$ UPDATE users SET timezone='America/New_York' WHERE first_name='UpdatedAlice' $$,
'Test 26: Update timezone to valid value succeeds');

SELECT throws_like(
$$ UPDATE users SET timezone=NULL WHERE first_name='UpdatedAlice' $$,
'%not-null constraint',
'Test 27: Update timezone to NULL fails');

SELECT throws_like(
$$ UPDATE users SET timezone='Invalid/Zone' WHERE first_name='UpdatedAlice' $$,
'%iana_timezone_check%',
'Test 28: Update timezone to invalid fails');

-- ========================================
-- 5. DELETE TESTS
-- ========================================
SELECT lives_ok(
$$ DELETE FROM users WHERE first_name='UpdatedAlice' $$,
'Test 29: Delete existing user succeeds');

SELECT lives_ok(
$$ DELETE FROM users WHERE first_name='NonExistent' $$,
'Test 30: Delete non-existent user does not fail');

-- ========================================
-- 6. DEFAULT created_at CHECK
-- ========================================
SELECT ok(
  (SELECT created_at IS NOT NULL FROM users WHERE first_name='Bob'),
  'Test 31: created_at is automatically set'
);

-- ========================================
-- Finish tests
-- ========================================
SELECT * FROM finish();

ROLLBACK;
