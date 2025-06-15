import pandas as pd
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session


class SaveDataToDatabase:
    def save_to_database(self, df, db: Session = None):
        """
        Save DataFrame to database using SQLAlchemy session
        
        Args:
            df: DataFrame to save
            db: SQLAlchemy session (required)
        """
        if df.empty:
            return {
                "message": "No data to save",
                "status": "success"
            }

        if db is None:
            return {
                "error": "Database session is required",
                "status": "failed"
            }

        try:
            # Get the underlying connection from the session
            connection = db.get_bind()
            
            # Check existing table structure
            inspector = inspect(connection)
            columns = inspector.get_columns("all_accidents_data")
            existing_column_names = [column["name"] for column in columns]

            # Alter table to add new columns if they don't exist
            for column in df.columns:
                if column not in existing_column_names:
                    query = f"ALTER TABLE all_accidents_data ADD COLUMN `{column}` TEXT"
                    db.execute(text(query))

            # Define chunk size for batch insertion
            chunksize = 50  # Adjust this size as needed

            # Insert data in chunks using the session's connection
            df.to_sql(
                name="all_accidents_data",
                con=connection,
                if_exists="append",
                index=False,
                chunksize=chunksize,
            )

            # Commit the session (let SQLAlchemy handle the transaction)
            db.commit()

            return {
                "message": "Data successfully imported into MySQL database",
                "status": "success"
            }

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            # Rollback the session in case of error
            db.rollback()
            return {"error": str(e), "status": "failed"}
        except Exception as e:
            print(f"Unexpected error: {e}")
            # Rollback the session in case of error
            db.rollback()
            return {"error": str(e), "status": "failed"}
