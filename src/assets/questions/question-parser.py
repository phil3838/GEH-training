import csv

def process_and_format_csv(filename):
    with open(filename, mode='r', encoding='utf-8') as file:
        lines = file.readlines()

    rows = []
    question = None
    question_count = 0 

    for line in lines:
        line = line.strip() 
        if line.startswith("R: "):

            response = line[3:].strip() 
            if question:
         
                question_combined = f'{", ".join(question)}'
                rows.append([question_combined, response])
                question_count += 1 
            question = []
        else:
 
            if question is None:
                question = []
            question.append(line)


    with open(filename, mode='w', encoding='utf-8', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(rows)

    print(f"Successfully processed and reformatted '{filename}' with {question_count} questions parsed.")

filename = 'tempfile-format-questions.csv'
process_and_format_csv(filename)