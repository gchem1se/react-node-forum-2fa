#!/bin/bash

DB_NAME="database.db"
SCHEMA_FILE="schema.sql"
POPULATE_FILE="populate.sql"

echo "Starting database reset process..."

# Delete existing database
if [ -f "$DB_NAME" ]; then
    echo "Deleting existing $DB_NAME..."
    rm "$DB_NAME" || { echo "Failed to delete $DB_NAME"; exit 1; }
else
    echo "$DB_NAME does not exist, skipping delete."
fi

# Create schema
if [ -f "$SCHEMA_FILE" ]; then
    echo "Creating schema from $SCHEMA_FILE..."
    sqlite3 "$DB_NAME" < "$SCHEMA_FILE"
    if [ $? -ne 0 ]; then
        echo "Error running schema file $SCHEMA_FILE"
        exit 1
    fi
else
    echo "Schema file $SCHEMA_FILE not found!"
    exit 1
fi

# Populate database
if [ -f "$POPULATE_FILE" ]; then
    echo "Populating database from $POPULATE_FILE..."
    sqlite3 "$DB_NAME" < "$POPULATE_FILE"
    if [ $? -ne 0 ]; then
        echo "Error running populate file $POPULATE_FILE"
        exit 1
    fi
else
    echo "Populate file $POPULATE_FILE not found!"
    exit 1
fi

echo "Database reset and populated successfully."
