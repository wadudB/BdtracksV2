import json
import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import text
from .service.GPT4Api import GPT4Api
from .service.Common import Common
from .service.SaveDataToDatabase import SaveDataToDatabase
from .service.DuplicateCheck import DuplicateCheck


class ScrapingApi:
    def __init__(self):
        self.common = Common()
        self.save_data_to_database = SaveDataToDatabase()

    def run_scraping(self, db: Session):
        try:
            # Get existing data from database using SQLAlchemy session
            db_data = self.get_data_from_database(db)
            existing_urls = [row["url"] for row in db_data]

            # Get latest news from newage
            newage_df = self.scrape_new_age(existing_urls)

            # Get latest news from dailystar
            dailystar_df = self.scrape_daily_star(existing_urls)

            # Get latest news form google alerts
            filtered_new_data = self.process_google_alerts(
                db_data, newage_df, dailystar_df
            )
            # Combine all news
            combined_df = self.merge_and_process_dataframes(
                existing_urls, newage_df, dailystar_df, filtered_new_data
            )
            # Get response from GPT4
            gpt4_api = GPT4Api()
            final_dataframe = gpt4_api.gpt4_response(combined_df)

            # Rename columns to database columns
            final_dataframe.rename(
                columns={
                    "is_type_of_accident_road_accident_or_train_accident_or_waterways_accident_or_plane_accident": "accident_type",
                    "is_reason_or_cause_for_the_accident_ploughed_or_ram_or_hit_or_collision_or_breakfail_or_others": "reason_or_cause_for_accident",
                },
                inplace=True,
            )

            duplicate_check = DuplicateCheck()
            final_dataframe_after_removing_duplicate = (
                duplicate_check.duplicate_data_check(final_dataframe, db_data)
            )

            save_to_database = self.save_data_to_database.save_to_database(
                final_dataframe_after_removing_duplicate, db
            )

            print("save_to_database", save_to_database)

            return save_to_database

        except Exception as e:
            print(f"An error occurred: {e}")
            raise

    def scrape_new_age(self, existing_urls):
        # Scrape the New Age website
        newage_upperframe = []

        page = 1
        max_pages = 10  # Safety limit to prevent infinite loop

        print(f"\n🔍 Starting New Age scraping (max {max_pages} pages)")
        print(f"📊 Starting with {len(existing_urls)} existing URLs in database")

        while page <= max_pages:  # page increments by 1 each time
            print(f"\n📄 Page {page}/{max_pages}")
            page_url = f"https://www.newagebd.net/tags/Road%20accident?page={page}"
            print(f"🌐 URL: {page_url}")

            try:
                response = requests.get(page_url)
                if response.status_code != 200:
                    print(f"❌ Failed to retrieve page: HTTP {response.status_code}")
                    break  # Stop if page doesn't exist

                soup = BeautifulSoup(response.text, "html.parser")

                # Updated selectors based on the new HTML structure
                articles = soup.find_all(
                    "article", class_="card card-full hover-a mb-module mb-md-5"
                )
                print(f"📰 Found {len(articles)} articles on page {page}")

                if len(articles) == 0:
                    print(f"⚠️  No articles found on page {page}, stopping")
                    break

                found_existing_url = False  # Flag to track if we found existing URLs
                new_articles_count = 0
                existing_articles_count = 0

                for article in articles:
                    try:
                        # Look for the title link in the h2 tag
                        title_element = article.find("h2", class_="card-title")
                        if title_element:
                            article_link = title_element.find("a")
                            if article_link and "href" in article_link.attrs:
                                article_url = article_link["href"].strip()
                                article_title = article_link.get(
                                    "title", article_link.get_text(strip=True)
                                )

                                if not article_url.startswith("http"):
                                    article_url = (
                                        "https://www.newagebd.net" + article_url
                                    )

                                if article_url not in existing_urls:
                                    new_articles_count += 1
                                    print(f"  ✅ NEW: {article_title[:60]}...")
                                    existing_urls.append(article_url)
                                    try:
                                        text, date, title = (
                                            self.common.extract_article_from_url(
                                                article_url
                                            )
                                        )
                                        if text and date:
                                            # Use the title from the link if extraction didn't get one
                                            final_title = (
                                                title if title else article_title
                                            )
                                            newage_upperframe.append(
                                                (date, article_url, text, final_title)
                                            )
                                            print(f"      📅 Date: {date}")
                                        else:
                                            print(f"      ❌ Failed to extract content")
                                    except Exception as extract_error:
                                        print(
                                            f"      ⚠️  Extraction error: {str(extract_error)[:100]}..."
                                        )
                                else:
                                    existing_articles_count += 1
                                    print(f"  🔄 EXISTS: {article_title[:60]}...")
                                    found_existing_url = True
                    except Exception as e:
                        print(f"Error processing article element: {e}")

                # Page summary
                print(
                    f"📊 Page {page} summary: {new_articles_count} new, {existing_articles_count} existing"
                )

                # If no articles found, try fallback selectors
                if not articles:
                    print(
                        "🔄 No articles found with primary selector, trying fallback..."
                    )

                    # Try original <li> selector as fallback
                    articles_li = soup.find_all("li")
                    print(f"📰 Found {len(articles_li)} <li> elements as fallback")

                    for article in articles_li:
                        try:
                            article_heading = article.find("h3")
                            if article_heading:
                                article_link = article_heading.find("a")
                                if article_link and "href" in article_link.attrs:
                                    article_url = article_link["href"].strip()
                                    if not article_url.startswith("http"):
                                        article_url = (
                                            "https://www.newagebd.net" + article_url
                                        )

                                    if article_url not in existing_urls:
                                        print(f"  ✅ NEW (fallback): {article_url}")
                                        existing_urls.append(article_url)
                                        try:
                                            text, date, title = (
                                                self.common.extract_article_from_url(
                                                    article_url
                                                )
                                            )
                                            if text and date:
                                                newage_upperframe.append(
                                                    (date, article_url, text, title)
                                                )
                                                print(f"      📅 Date: {date}")
                                        except Exception as extract_error:
                                            print(
                                                f"      ⚠️  Fallback extraction error: {str(extract_error)[:100]}..."
                                            )
                                    else:
                                        print(f"  🔄 EXISTS (fallback): {article_url}")
                                        found_existing_url = True
                        except Exception as e:
                            print(f"Error processing fallback <li> element: {e}")

            except Exception as e:
                print(f"❌ Error processing page {page}: {str(e)[:100]}...")
                break  # Stop on error

            # Check if we found existing URLs on this page
            if found_existing_url:
                print(f"🛑 Found existing URLs on page {page}, stopping scraping")
                break

            # Move to next page
            page += 1

        print(f"\n🎯 Scraping completed!")
        print(f"📈 Total new articles extracted: {len(newage_upperframe)}")
        print(f"📊 Final database size: {len(existing_urls)} URLs")

        # Create DataFrame for New Age articles
        newage_df = pd.DataFrame(
            newage_upperframe,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "article_title",
            ],
        )
        newage_df["source"] = "newagebd"
        newage_df["accident_datetime_from_url"] = pd.to_datetime(
            newage_df["accident_datetime_from_url"], errors="coerce"
        )
        newage_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )

        return newage_df

    def scrape_daily_star(self, existing_urls):
        dailystar_upperframe = []

        print(f"\n🔍 Starting Daily Star scraping")
        print(f"📊 Starting with {len(existing_urls)} existing URLs in database")

        # Keep track of original existing URLs (from database)
        original_existing_urls = set(existing_urls.copy())

        # Scrape using Load More functionality
        page = 1
        max_pages = 20  # Safety limit
        found_existing = False

        while page <= max_pages and not found_existing:
            if page == 1:
                page_url = (
                    "https://www.thedailystar.net/news/bangladesh/accidents-fires"
                )
            else:
                page_url = f"https://www.thedailystar.net/news/bangladesh/accidents-fires?page={page}"

            print(f"\n📄 Daily Star Page {page}")
            print(f"🌐 URL: {page_url}")

            try:
                headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
                response = requests.get(page_url, headers=headers, timeout=30)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")

                    initial_count = len(dailystar_upperframe)
                    total_new_this_page = 0
                    total_existing_this_page = 0
                    original_existing_this_page = 0

                    if page == 1:
                        print("📰 Processing main news section...")
                        main_new, main_existing, main_original_existing = (
                            self.extract_articles_dailystar(
                                soup,
                                "panel-pane pane-category-news no-title block",
                                existing_urls,
                                dailystar_upperframe,
                                original_existing_urls,
                            )
                        )
                        total_new_this_page += main_new
                        total_existing_this_page += main_existing
                        original_existing_this_page = main_original_existing
                    else:
                        # For subsequent pages, only process load-more section
                        pass

                    print("📰 Processing load-more section...")
                    loadmore_new, loadmore_existing, loadmore_original_existing = (
                        self.extract_articles_dailystar(
                            soup,
                            "panel-pane pane-category-load-more no-title block",
                            existing_urls,
                            dailystar_upperframe,
                            original_existing_urls,
                        )
                    )
                    total_new_this_page += loadmore_new
                    total_existing_this_page += loadmore_existing
                    original_existing_this_page += loadmore_original_existing

                    print(
                        f"📊 Page {page} summary: {total_new_this_page} new, {total_existing_this_page} existing"
                    )

                    # Check if we found original existing URLs (from database, not current session)
                    if original_existing_this_page > 0:
                        print(
                            f"🎯 Found {original_existing_this_page} original existing URLs from database, stopping pagination"
                        )
                        found_existing = True
                        break

                    # Check if there are more pages by looking for Load More button
                    load_more = soup.find("div", class_="item-list item-list-pager")
                    if load_more:
                        next_link = load_more.find("a", href=True)
                        if next_link and "page=" in next_link["href"]:
                            page += 1
                            print(
                                f"🔄 Found Load More button, continuing to page {page}"
                            )
                        else:
                            print(f"🏁 No more Load More button found, stopping")
                            break
                    else:
                        print(f"🏁 No pagination found, stopping")
                        break

                else:
                    print(f"❌ Failed to retrieve page: HTTP {response.status_code}")
                    break

            except Exception as e:
                print(f"❌ Error processing page: {str(e)[:100]}...")
                break

        if page >= max_pages:
            print(f"⚠️  Reached maximum page limit ({max_pages})")

        # Create DataFrame for The Daily Star articles
        dailystar_df = pd.DataFrame(
            dailystar_upperframe,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "article_title",
            ],
        )
        dailystar_df["source"] = "dailystar"
        dailystar_df["accident_datetime_from_url"] = pd.to_datetime(
            dailystar_df["accident_datetime_from_url"],
            format="%m/%d/%Y %I:%M:%S %p",
            errors="coerce",
        )
        dailystar_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )

        # Status after converting dates to datetime
        invalid_dates = dailystar_df[
            pd.isnull(dailystar_df["accident_datetime_from_url"])
        ]
        if len(invalid_dates) > 0:
            print(f"⚠️  {len(invalid_dates)} articles with invalid dates found")

        print(f"\n🎯 Daily Star scraping completed!")
        print(f"📈 Total new articles extracted: {len(dailystar_df)}")
        print(f"📊 Final database size: {len(existing_urls)} URLs")

        return dailystar_df

    def extract_articles_dailystar(
        self,
        soup,
        container_class,
        existing_urls,
        dailystar_upperframe,
        original_existing_urls=None,
    ):
        articles_container = soup.find("div", class_=container_class)
        if not articles_container:
            print(f"⚠️  No container found for class: {container_class}")
            return 0, 0, 0  # Return new_count, existing_count, original_existing_count

        # Updated selector for new structure
        articles = articles_container.find_all(
            "div",
            class_="card position-relative horizontal type-horizontal-list row border-bottom collapse image-reverse",
        )

        # Fallback to old structure if new structure not found
        if len(articles) == 0:
            articles = articles_container.find_all("div", class_="card")
            print(
                f"📰 Using fallback selector, found {len(articles)} articles in {container_class}"
            )
        else:
            print(
                f"📰 Using new selector, found {len(articles)} articles in {container_class}"
            )

        if len(articles) == 0:
            print(f"⚠️  No articles found in container with either selector")
            return 0, 0, 0  # Return new_count, existing_count, original_existing_count

        new_articles_count = 0
        existing_articles_count = 0
        original_existing_count = 0

        if original_existing_urls is None:
            original_existing_urls = set()

        for article in articles:
            try:
                # Look for link in the title section (new structure)
                title_element = article.find("h3", class_="title")
                if title_element:
                    link_element = title_element.find("a", href=True)
                else:
                    # Fallback to any link in the article (old structure)
                    link_element = article.find("a", href=True)

                if not link_element:
                    continue

                article_url = (
                    "https://www.thedailystar.net" + link_element["href"].strip()
                )

                # Get article title for better debugging
                if title_element:
                    article_title_preview = link_element.get_text(strip=True)[:60]
                else:
                    # Try other title selectors
                    title_elem = (
                        article.find("h3") or article.find("h2") or article.find("h4")
                    )
                    article_title_preview = (
                        title_elem.get_text(strip=True)[:60]
                        if title_elem
                        else "No title found"
                    )

                if article_url not in existing_urls:
                    new_articles_count += 1
                    print(f"  ✅ NEW: {article_title_preview}...")
                    existing_urls.append(article_url)
                    (
                        article_text,
                        article_date,
                        article_title,
                    ) = self.common.extract_article_from_url(article_url)
                    if article_text:
                        dailystar_upperframe.append(
                            (article_date, article_url, article_text, article_title)
                        )
                        print(f"      📅 Date: {article_date}")
                    else:
                        print(f"      ❌ Failed to extract content")
                else:
                    existing_articles_count += 1
                    # Check if this is an original existing URL (from database)
                    if article_url in original_existing_urls:
                        original_existing_count += 1
                        print(f"  🎯 ORIGINAL EXISTS: {article_title_preview}...")
                    else:
                        print(f"  🔄 EXISTS: {article_title_preview}...")

            except Exception as e:
                print(f"      ⚠️  Article parsing error: {str(e)[:100]}...")

        print(
            f"📊 Section summary: {new_articles_count} new, {existing_articles_count} existing ({original_existing_count} original)"
        )
        return new_articles_count, existing_articles_count, original_existing_count

    # google alerts
    @staticmethod
    def process_google_alerts(db_data, newage_df, dailystar_df):
        # Read data from Google Sheets
        url = (
            "https://script.googleusercontent.com/macros/echo?user_content_key=TBl6w-PXrtKncKWautn1veXtaFQ"
            "-ecpXFPa4IBZdXJxUJIcW8JdyIIZaxEvUTIYFKMtR9sclfRRHqVQOwH"
            "-fCTmBM2kqG_Jwm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnIR7_8zx0SnAcTyKhiDjFJog"
            "Eiq0GCvu9ZDlbPhWKtOpxfFKrF4gmjL3PvqrvDPP0zxQI-yyFg9nj-F6zXSU5dNfc25gsAtQqtz9Jw9Md8uu&lib="
            "MdKNnO8w5eDiIr8Ec6LLzmCFdP9j9HByt"
        )  # Replace with your web app URL
        print("url", url)
        response = requests.get(url)

        if response.status_code == 200:
            data = json.loads(response.text)
            # print(data)
        else:
            print("Failed to retrieve data:", response.status_code)
        headers = data[0]  # This is the first row, which contains the column names
        rows = data[1:]  # This is the rest of your data

        def standardize_date(date_str):
            try:
                # Assuming the date format in your data is like
                date_obj = datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S.%fZ")
                return date_obj.strftime("%m/%d/%Y %I:%M:%S %p")
            except ValueError:
                print(f"Error processing date: {date_str}")
                return None

        # Process Google Alerts data

        new_data_df = pd.DataFrame(rows, columns=headers)
        # Assuming 'new_data_df' is the DataFrame loaded from the Google Sheet
        # new_data_df['Date & Time'] = pd.to_datetime(new_data_df['Date & Time'].apply(standardize_date))
        new_data_df["Date & Time"] = pd.to_datetime(
            new_data_df["Date & Time"].apply(standardize_date), errors="coerce"
        )
        new_data_df["Date & Time"] += timedelta(hours=12)
        new_data_df["source"] = "google alerts"
        new_data_df = new_data_df.drop_duplicates(subset="URL")

        # Assuming you have a column 'accident_datetime_from_url' in existing_df
        google_alerts_df = [row for row in db_data if row["source"] == "google alerts"]
        most_recent_date_google_alerts = max(
            row["accident_datetime_from_url"] for row in google_alerts_df
        )

        cut_off_date = most_recent_date_google_alerts - timedelta(
            days=2
        )  # Adjust the number of days as needed
        # Filter new_data_df for recent entries
        recent_google_alerts_df = new_data_df[
            pd.to_datetime(new_data_df["Date & Time"]) >= cut_off_date
        ]
        # Existing Google Alerts URLs
        existing_google_alerts_urls = set(
            row["url"] for row in db_data if row["source"] == "google alerts"
        )

        # Filter recent_google_alerts_df for new URLs
        new_filtered_data = recent_google_alerts_df[
            ~recent_google_alerts_df["URL"].isin(existing_google_alerts_urls)
        ]

        # Exclude articles with URLs already in New Age and The Daily Star
        google_alerts_urls_to_exclude = set(
            newage_df["url"].tolist() + dailystar_df["url"].tolist()
        )
        filtered_new_data = new_filtered_data[
            ~new_filtered_data["URL"].isin(google_alerts_urls_to_exclude)
        ].copy()  # Create explicit copy to avoid SettingWithCopyWarning

        filtered_new_data["accident_datetime_from_url"] = filtered_new_data[
            "Date & Time"
        ]

        return filtered_new_data

    def merge_and_process_dataframes(
        self, existing_urls, newage_df, dailystar_df, filtered_new_data
    ):
        articles_data = []
        for index, row in filtered_new_data.iterrows():
            print("index:", index)
            date_time = row["accident_datetime_from_url"]
            source = row["source"]
            url = row["URL"]

            if url not in existing_urls:
                try:
                    # Process the new URL
                    existing_urls.append(url)  # Append the new URL to the existing list
                    (
                        article_text,
                        article_date,
                        article_title,
                    ) = self.common.extract_article_from_url(url)
                    article_date = date_time if article_date is None else article_date
                    if article_text:  # assuming you meant article_text here
                        articles_data.append(
                            (article_date, url, article_text, source, article_title)
                        )
                except Exception as e:
                    print(f"Error in article parsing for URL {url}: {e}")

        # Create a DataFrame for the new articles
        new_articles_df = pd.DataFrame(
            articles_data,
            columns=[
                "accident_datetime_from_url",
                "url",
                "articles_text_from_url",
                "source",
                "article_title",
            ],
        )

        # Merge DataFrames
        combined_df = pd.concat([newage_df, dailystar_df, new_articles_df]).reset_index(
            drop=True
        )
        combined_df["accident_datetime_from_url"] = pd.to_datetime(
            combined_df["accident_datetime_from_url"], errors="coerce"
        )

        combined_df.sort_values(
            by="accident_datetime_from_url", na_position="last", inplace=True
        )
        combined_df = combined_df.drop_duplicates(subset="url")

        df = []
        # Check if there is any new data to process
        if not combined_df.empty:
            # Apply the standardize_date function to the 'Date & Time' colum
            # Function to calculate text similarity
            def calculate_similarity(text_list):
                try:
                    # Lazy import sklearn modules only when needed
                    from sklearn.metrics.pairwise import cosine_similarity
                    from sklearn.feature_extraction.text import TfidfVectorizer
                    import gc

                    # Limit the number of features to prevent memory issues
                    vectorized = TfidfVectorizer(
                        max_features=1000, stop_words="english"
                    )
                    tfidf_matrix = vectorized.fit_transform(text_list)
                    similarity_matrix = cosine_similarity(tfidf_matrix)

                    # Clean up memory
                    del tfidf_matrix
                    gc.collect()

                    return similarity_matrix
                except ImportError:
                    print(
                        "Warning: scikit-learn not available. Install with: pip install -e .[ml]"
                    )
                    # Return a simple similarity matrix with no duplicates detected
                    n = len(text_list)
                    return [
                        [0.0 for _ in range(n)] for _ in range(n)
                    ]  # No similarity detected without ML libraries
                except Exception as e:
                    print(f"Error in similarity calculation: {e}")
                    # Return a simple similarity matrix with no duplicates detected on error
                    n = len(text_list)
                    return [[0.0 for _ in range(n)] for _ in range(n)]

            # Revised function to check relevance based on keywords
            def is_relevant_article(text, accident_keywords):
                text_lower = text.lower()
                return any(keyword in text_lower for keyword in accident_keywords)

            # Accident-related keywords
            accident_keywords = [
                "road accident",
                "accident",
                "accidents",
                "traffic",
                "capsize",
                "overturned",
                "slam",
                "capsize",
                "hit",
                "ran over",
                "run over",
                "collided",
                "road accidents",
                "traffic",
                "collision",
                "crashed",
                "collision",
                "collisions",
                "train crash",
                "road and railway accidents",
                "railway accidents",
                "crashes",
                "crash",
            ]

            # Apply relevance filter
            combined_df["Relevant"] = combined_df["articles_text_from_url"].apply(
                lambda x: is_relevant_article(x, accident_keywords)
            )

            # Filter to keep only relevant articles - create explicit copy to avoid SettingWithCopyWarning
            relevant_df = combined_df[combined_df["Relevant"]].copy()

            # Initialize 'Duplicate' column to False in relevant DataFrame
            relevant_df.loc[:, "Duplicate"] = False

            # Process for each unique date for duplicate detection
            relevant_df.loc[:, "Date"] = pd.to_datetime(
                relevant_df["accident_datetime_from_url"]
            ).dt.date
            unique_dates = relevant_df["Date"].unique()

            for date in unique_dates:
                daily_articles = relevant_df[relevant_df["Date"] == date]
                if len(daily_articles) > 1:
                    summaries = daily_articles["articles_text_from_url"].tolist()
                    similarity_matrix = calculate_similarity(summaries)

                    # Mark duplicates
                    for i in range(len(similarity_matrix)):
                        for j in range(i + 1, len(similarity_matrix)):
                            if (
                                similarity_matrix[i][j] > 0.9
                            ):  # Adjust threshold as needed
                                relevant_df.at[daily_articles.index[j], "Duplicate"] = (
                                    True
                                )

            # Filter out duplicates
            ultimate_final_df = relevant_df[~relevant_df["Duplicate"]]

            # Display the final DataFrame

            df = pd.DataFrame(
                ultimate_final_df,
                columns=[
                    "accident_datetime_from_url",
                    "url",
                    "articles_text_from_url",
                    "source",
                    "article_title",
                ],
            )

        else:
            print("No new data to process.")

        df = df.reset_index(drop=True)

        return df

    @staticmethod
    def get_data_from_database(db: Session):
        try:
            query = text("SELECT * FROM `all_accidents_data`")
            result = db.execute(query)
            rows = result.fetchall()

            # Convert rows to dictionaries
            return [dict(row._mapping) for row in rows]

        except Exception as e:
            print(f"Error: {e}")
            raise
