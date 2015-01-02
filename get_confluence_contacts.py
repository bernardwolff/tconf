import datetime
from timeit import default_timer as timer
import json
import mechanize
from BeautifulSoup import BeautifulSoup 
Soup = BeautifulSoup
import BeautifulSoup
import ConfigParser

start = timer()

Config = ConfigParser.ConfigParser()
Config.read("confluence.ini")

# copied from https://wiki.python.org/moin/ConfigParserExamples
def ConfigSectionMap(section):
    dict1 = {}
    options = Config.options(section)
    for option in options:
        try:
            dict1[option] = Config.get(section, option)
            if dict1[option] == -1:
                DebugPrint("skip: %s" % option)
        except:
            print("exception on %s!" % option)
            dict1[option] = None
    return dict1

confluence_config = ConfigSectionMap("Confluence")
domain = confluence_config['domain']
username = confluence_config['username']
password = confluence_config['password']

browser = mechanize.Browser()
browser.open("https://" + domain + "/confluence/dologin.action")
browser.select_form(name="loginform")
browser["os_username"] = username
browser["os_password"] = password
browser.submit()

print("submitted login form")

browser.open("https://" + domain + "/confluence/browsepeople.action")

all_users = []
page = 1

while True:
    soup = Soup(browser.response().read())
     
    users = soup.findAll("h4", "profile-username")
    for user in users:
        a = user.find("a")
        name = a.string
        username = a["data-username"]
        all_users.append({"name": name, "username": username})
        #print(name)

    print("retrieved {0} users from page {1}").format(len(users), page)

    next_page = soup.find("a", "pagination-next")
    if next_page is None:
        break

    page += 1
    browser.open(next_page["href"])

filename = "www/confluence_users.json"
with open(filename, "w") as outfile:
    json.dump(all_users, outfile)

end = timer()
elapsed = str(datetime.timedelta(seconds = end - start))

print("wrote {0} users to {1} in {2}").format(len(all_users), filename, elapsed)
