
import csv;
with open('StateLongLat.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    f= open("states.geojson","w+")
    f.write('{')
    f.write('"type": "FeatureCollection",')
    f.write('"features": [')
    f.write("\n")
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
        else:
            print(f'\t{row[0]} works in the {row[1]} department, and was born in {row[2]}.')
            f.write("\n")
            f.write('{ "type": "Feature", "id": "'+row[0]+'", "properties": { "LAT": '+row[1]+', "LON":'+row[2]+' }, "geometry": { "type": "Point", "coordinates": [ '+row[2]+', '+row[1]+' ] } },')

            line_count += 1
    print(f'Processed {line_count} lines.')
