from website.app import db

db.drop_all()
db.create_all()

import pandas as pd
import os
from sqlalchemy import create_engine


database = 'db.sqlite'
path = os.path.join('sqlite:///', 'website', f'{database}')

engine = create_engine(path)

data = os.path.join('website', 'data', 'aggregate.csv')
df = pd.read_csv(data)

df.to_sql(name='Flow', con=engine, if_exists='replace', index=False)