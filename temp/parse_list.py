import re
import json

filename = "temp\course_list_simplified.txt"
with open(filename, "r", encoding='utf8') as f:
    content = f.readlines()

course_list = {}
department = "Invalid department"
for line in content:
    search = re.search("[A-Z]{3}[A-E1-4][OMUCDPELX][M0-9]", line)
    if (search):
        name = (line[search.span()[1]:]).strip()
        grade = (line[search.span()[0]+3:search.span()[0]+4]).strip()
        grade_search = re.search("[0-9]", grade)
        grade_num = -1
        if(grade_search):
            grade_num = int(grade)
        course_list[search.group()] = {"department":department, "name":name, "grade":grade_num}
    else:
        department = line.strip()

with open("course_list.json", "w", encoding='utf8') as f:
    json.dump(course_list, f)

print("Course list convertted successfully!")
