#!/usr/bin/env python
import os
import sys

import numpy as np

AppName = "spark_assignment_2"
TMPDIR = "/cs/work/scratch/spark-tmp"

### Creat a Spark context on Ukko cluster
from pyspark import SparkConf, SparkContext
conf = (SparkConf()
        .setMaster("spark://ukko080:7077")
        .setAppName(AppName)
        .set("spark.rdd.compress", "true")
        .set("spark.broadcast.compress", "true")
        .set("spark.cores.max", 20)
        .set("spark.local.dir", TMPDIR))
sc = SparkContext(conf = conf)

def calculate_element(col, row):
    result = 0.0

    for i in range(0, len(col)):
        result += col[i] * row[i]

    return result

def print_element(element, idx):


if __name__=="__main__":
    data = sc.textFile('/cs/work/scratch/spark-data/data-2-sample.txt')

    data = data.map(lambda row: map(float, row.split(' ')))

    # get the matrix as an matrix_1ay of cols to make multiplying easier

    # split the matrix into an matrix_1ay of elements paired with indexes
    matrix_1 = data.zipWithIndex().flatMap(lambda (x, i): [(i, j, element) for (j, element) in enumerate(x)])

    # spaw x and y values of each element and organize the data
    matrix_1 = matrix_1.map(lambda (i, j, element): (j, (i, element))).groupByKey().sortByKey()
    matrix_1 = matrix_1.map(lambda (i, x): sorted(list(x), cmp=lambda (i1, e1), (i2, e2) : cmp(i1, i2)))
    matrix_1 = matrix_1.map(lambda x: map(lambda (i, y): y, x))

    # parse the data back into an matrix_1ay of matrix_1ays
    matrix_1 = matrix_1.map(lambda x: np.asarray(x))

    # create a list where each element is a pair of row and col for the elements to be multiplied and summed (row of transpose = col of original matrix)
    matrix_1 = matrix_1.cartesian(matrix_1)

    # calculate elements of A x AT
    matrix_1 = matrix_1.map(lambda (col, row): calculate_element(col, row))

    # transform the matrix_1ay back to an matrix_1ay of cols
    matrix_1 = matrix_1.collect()

    matrix_2 = []
    for i in range(0, 1000):
        matrix_2.append(matrix_1[i*1000:(i+1)*1000])

    # write the diagonal of A x AT to a file
    diag_file = open("assignent_2_2.txt", "w")
    save_element = 0

    arr = []
    diag_matrix = []
    for i in range(0, len(matrix_1)):
        if i == save_element:
            arr.append(matrix_1[i])
            save_element += 1001
        else:
            arr.append[0]

        if len(arr) == 1000:
            diag_matrix.append(arr)
            arr = []

    # assign matrix diag(A x AT) to matrix_1
    matrix_1.parallelize(diag_matrix)

    diag_file.close()

    matrix_3 = data.map(lambda row: map(float, row.split(' ')))
    matrix_2 = sc.parallelize(matrix_2).cartesian(matrix_3)

    matrix_2 = matrix_2.map(lambda (col, row): calculate_element(col, row))

    # matrix_2 now contains matrix A x AT x A as an array that could be formatted for an output
    print matrix_2.count()

    sys.exit(0)